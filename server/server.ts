require('dotenv').config();
import express, { Request, Response, Application } from 'express';
import { Prisma, PrismaClient, Company, Users, Role, Fleet, Truck, Maintenance, Inventory, PhotoAreas, Photos, Equipment } from '@prisma/client';
import QRCode from "qrcode"

const app: Application = express();
const PORT = process.env.PORT;
const prisma = new PrismaClient();

app.set('json spaces', 4)
app.use(express.json())

app.get("/", (req: Request, res: Response): void => {
    res.send("Gaucho Index");
});

type Group = {
    name: string,
    trucks: Truck[]
}

// works
app.post("/create-account", async (req: Request, res: Response) => {
    // req: company name, phone number, email, and password

    // >>>  Create a uuid for the company and attribute the copmany information 

    // res: 201 and cookie w/ company uuid || 4xx

    try {
        const companyName: string = req.body.companyName;
        const phoneNumber: string = req.body.phoneNumber;    //needs to be validated with Zod
        const email: string = req.body.email;                //needs to be validated with Zod

        const company = await prisma.company.create({
            data: {
                name: companyName,
                email: email,
                phoneNumber: phoneNumber
            }
        })

        return res.status(201).json(company)
    } catch (err) {
        console.log('error creating company')
        console.log(err)
        return res.sendStatus(400)
    }
})

// works
app.post("/setup/fleet", async (req: Request, res: Response) => {
    // req: Fleet[Trucks[{Truck Name, Liscense Plate, VIN#}, ...], Trucks[...]] and company id
    /* Fleet[{name: name, trucks: [Truck{...}, Truck{...}]},
            {name: name, trucks: [Truck{...}, Truck{...}]}] */

    // >>>  Create a trucks table and then a uuid for each truck 
    // then attribute the information supplied to the table
    // then generate a url to attribute to the truck based off of its name

    // res: 201 and Trucks[...] || 4xx


    try {
        const companyID = req.body.companyID
        const fleet: Group[] = req.body.fleet;

        fleet.forEach(async group => {
            const flotilla = await prisma.fleet.create({
                data: {
                    name: group.name,
                    companyId: companyID
                }
            })

            group.trucks.forEach(async truck => {
                const vehicle = await prisma.truck.create({
                    data: {
                        name: truck.name,
                        vin: truck.vin,
                        license: truck.license,
                        year: truck.year,
                        fleetId: flotilla.id
                    }
                })
            })
        });

        return res.sendStatus(201)
    } catch (err) {
        console.log(err)
        return res.sendStatus(400)
    }

})

// works :)
app.post("/setup/inventory", async (req: Request, res: Response) => {
    // req: Trucks[{Truck Name, Equipment[Equipment 1, Equipment 2, ...Equipment n]}, ...]

    // >>>  Add the equipment information to the indivisual truck tables using the truck name to identify the uuid

    // res: 201 and Truks[Truck Name, Equipment[...]] || 4xx

    const companyID: string = req.body.companyID

    const inventory: {
        truckName: string,
        inventory: {
            [key: string]: any
        }
    }[] = req.body.inventory

    for (const currTruck of inventory) {
        // get the current truck that matches the current truck in the inventory
        const truck = await prisma.truck.findFirst({
            where: {
                name: currTruck.truckName
            }
        })

        // get all the equipment for the company
        let equipment = await prisma.equipment.findMany({
            include: {
                Company: {
                    where: {
                        id: companyID
                    }
                }
            }
        })

        // create an array of equipment names in the equipment table and in the given inventory
        const equipmentNames = equipment.map(equipment => equipment.name)

        // create an array of equipment names from inventory object
        let inventoryNames: string[] = []
        for (let equipment in currTruck.inventory) {
            inventoryNames.push(equipment)
        }

        console.log(currTruck.truckName + "\n")
        console.log("Inventory Names: " + inventoryNames)
        console.log("Equipment Names: " + equipmentNames)

        // if the equipment in the inventory is not in the database create a new equipment entry
        const itemsAreInTable = inventoryNames.every(item => equipmentNames.includes(item))
        // console.log("items are in table: " + itemsAreInTable)
        if (itemsAreInTable == false) {
            let newEquipment: string[]

            newEquipment = inventoryNames.filter(item => !equipmentNames.includes(item))
            console.log("\nNew Items: " + newEquipment)

            // console.log("\n")
            for (const item of newEquipment) {
                const newEquipment = await prisma.equipment.create({
                    data: {
                        name: item,
                        companyId: companyID
                    }
                })
                // console.log(newEquipment)
            }

            // reassign the value for the equipment in the DB to get new items
            equipment = await prisma.equipment.findMany({
                include: {
                    Company: {
                        where: {
                            id: companyID
                        }
                    }
                }
            })
        }

        // add the database ID for all of the equipment in the given truck's inventory
        for (const [key, value] of Object.entries(currTruck.inventory)) {

            const equipmentObj = equipment.find(obj => obj.name === key)

            currTruck.inventory[key].dbID = equipmentObj!.id
        }

        // create an array of objects for the relation of each new inventory record to the existing equipment in the DB
        let inventoryUploadObj: any = []
        for (const [key, value] of Object.entries(currTruck.inventory)) {
            // console.log("upload " + key)
            // console.log(currTruck.inventory)
            // console.log('\n')
            const equipmentID = currTruck.inventory[key].dbID
            // console.log(equipmentID)
            inventoryUploadObj.push({
                quantity: value.quantity,
                equipment: {
                    connectOrCreate: {
                        where: {
                            id: equipmentID
                        },
                        create: {
                            name: key,
                            companyId: companyID
                        }
                    }
                }
            })
        }
        // console.log(inventoryUploadObj[0])

        // create the inventory record for currTruck in the DB with Equipment[]
        const newInventory = await prisma.inventory.create({
            data: {
                truckId: truck!.id,
                equipmentItems: {
                    create: inventoryUploadObj,
                },
            },
        })

        console.log("\n------------------\n")
    };

    return res.sendStatus(201)
})

// works :)
app.get("/print-qr-codes", async (req: Request, res: Response) => {
    // req: companyID

    // >>>  find all truck urls on the truck table and save to TruckURLs[{TruckName, TruckURL}]
    //client will generate the QR code

    // res: 200 and TruckURLs[] || 4xx

    const companyID = req.body.companyID

    const dbTrucks = await prisma.truck.findMany({
        where: {
            Fleet: {
                companyId: {
                    equals: companyID,
                }
            }
        }
    });

    function createURLs(trucks: Truck[]): string[] {
        let URLs: string[] = []
        trucks.forEach(truck => {
            URLs.push(`${process.env.CLIENT_URL}/trucks/qr/${truck.id}`)
        });
        return URLs;
    }
    const urlArr = createURLs(dbTrucks)

    res.status(201).json(urlArr)
})

// works
app.get("/trucks/qr/:truckID", async (req: Request, res: Response) => {
    const truckID = req.params.truckID
    const generateQR = async () => {
        try {
            const imgURL = await QRCode.toDataURL(`${process.env.CLIENT_URL}/trucks/${truckID}`)
            console.log(imgURL)
            res.write(imgURL)
        } catch (err) {
            console.error(err)
            res.sendStatus(204)
        }
    }
    return generateQR()
})

// works
app.post("/upload/maintenance", async (req: Request, res: Response) => {
    // req: Truck{milage, oil level, coolant level, tire tread level{}, notes}, truckID

    // >>>  create a uuid for the maintenance update, get the current date/time, save info to the update table

    // res: 200 and maintenance{} || 4xx

    const truckID = req.body.truckID

    const maintenanceUpdate = await prisma.maintenance.create({
        data: {
            mileage: Number(req.body.mileage),
            oil: req.body.oil,
            coolant: req.body.coolant,
            frontDriverTread: req.body.tireTread.frontDriver,
            frontPassengerTread: req.body.tireTread.frontPassanger,
            rearDriverTread: req.body.tireTread.rearDriver,
            rearPassengerTread: req.body.tireTread.rearPassanger,
            notes: req.body.notes,
            truckId: truckID
        }
    })

    return res.status(201).json(maintenanceUpdate)
})

//works
app.post("/upload/inventory", async (req: Request, res: Response) => {
    // req: maintenace{...{equipment 1, equipment 2, ...equipment n}}, truckID

    // >>>  save the inventory to maintenace{} in DB

    // res: 200 and maintenance{} || 4xx

    const companyID = req.body.companyID
    const truckID = req.body.inventory.truckID
    const inventory: {
        truckName: string,
        truckID: string
        inventory: {
            [key: string]: any
        }
    } = req.body.inventory

    // get the current truck that matches the current truck in the inventory
    const truck = await prisma.truck.findFirst({
        where: {
            id: truckID
        }
    })

    let equipment = await prisma.equipment.findMany({
        include: {
            Company: {
                where: {
                    id: companyID
                }
            }
        }
    })

    // create an array of equipment names in the equipment table and in the given inventory
    const equipmentNames = equipment.map(equipment => equipment.name)

    // create an array of equipment names from inventory object
    let inventoryNames: string[] = []
    for (let equipment in inventory.inventory) {
        inventoryNames.push(equipment)
    }

    console.log(truck!.name + "\n")
    console.log("Inventory Names: " + inventoryNames)
    console.log("Equipment Names: " + equipmentNames)

    // if the equipment in the inventory is not in the database create a new equipment entry
    const itemsAreInTable = inventoryNames.every(item => equipmentNames.includes(item))
    // console.log("items are in table: " + itemsAreInTable)
    if (itemsAreInTable == false) {
        let newEquipment: string[]

        newEquipment = inventoryNames.filter(item => !equipmentNames.includes(item))
        console.log("\nNew Items: " + newEquipment)

        // console.log("\n")
        for (const item of newEquipment) {
            const newEquipment = await prisma.equipment.create({
                data: {
                    name: item,
                    companyId: companyID
                }
            })
            // console.log(newEquipment)
        }

        // reassign the value for the equipment in the DB to get new items
        equipment = await prisma.equipment.findMany({
            include: {
                Company: {
                    where: {
                        id: companyID
                    }
                }
            }
        })
    }

    // add the database ID for all of the equipment in the given truck's inventory
    for (const [key, value] of Object.entries(inventory.inventory)) {

        const equipmentObj = equipment.find(obj => obj.name === key)

        inventory.inventory[key].dbID = equipmentObj!.id
    }

    // create an array of objects for the relation of each new inventory record to the existing equipment in the DB
    let inventoryUploadObj: any = []
    for (const [key, value] of Object.entries(inventory.inventory)) {
        // console.log("upload " + key)
        // console.log(currTruck.inventory)
        // console.log('\n')
        const equipmentID = inventory.inventory[key].dbID
        // console.log(equipmentID)
        inventoryUploadObj.push({
            quantity: value.quantity,
            equipment: {
                connectOrCreate: {
                    where: {
                        id: equipmentID
                    },
                    create: {
                        name: key,
                        companyId: companyID
                    }
                }
            }
        })
    }
    // console.log(JSON.stringify(inventoryUploadObj[0]))

    // create the inventory record for currTruck in the DB with Equipment[]
    const newInventory = await prisma.inventory.create({
        data: {
            truckId: truck!.id,
            equipmentItems: {
                create: inventoryUploadObj,
            },
        },
    })

    return res.sendStatus(201)
})

app.post("/upload/pictures", async (req: Request, res: Response) => {
    // req: maintenance{...Photos{front:IMG_1653.jpg, back:IMG_1654.jpg, ...n:IMG_16nn}}

    // >>>  give each photo in maintenece{} a uuid
    // save photo to cloudinary w/ uuid

    // res: 200 and redirect to the success screen(?) || 4xx

    const truckID = req.body.truckID

    const photoAreas = await prisma.photoAreas.findMany({
        where: {
            truckId: truckID
        }
    })

    if (photoAreas.length == 0) {
        // send a message that there are no defined photo areas for the truck
        return res.sendStatus(204)
    } else {
        // upload photos to cloudinary, retreive their URLs
        // then save them to the approprate photo area's record in prisma
    }

    return res.sendStatus(201)
})

app.get("/account/company", async (req: Request, res: Response) => {
    // req: companyID

    // >>>  get company email, address, notification settings

    // res: 200 and company{} || 4xx

    const companyID = req.body.companyID

    const company = await prisma.company.findUnique({
        where: {
            id: companyID
        }
    })

    return res.status(200).json(company)
})

app.post("/account/company", async (req: Request, res: Response) => {
    // req: newCompanyInfo{email}

    // >>>  update compnay info in DB

    // res: 201 and company{updatedInfo} || 4xx

    // map the given req.body.data to an object

    const company = await prisma.company.update({
        where: {
            id: req.body.companyID,
        },
        data: {
            //req.body.data
        }
    })

    return res.status(200)
})

app.get("/account/users", async (req: Request, res: Response) => {
    // >>>  get all users in company's user table

    //res: 200 and users[] || 4xx

    const users = await prisma.users.findMany({
        where: {
            companyId: req.body.companyId
        }
    })

    return res.status(200).json(users)
})

app.post("/account/users", async (req: Request, res: Response) => {
    // req: newUserInfo{uuid, name}

    // >>>  updates the user's info in DB

    // res: 201 and users[user{updatedInfo}] || 4xx

    const users = await prisma.users.update({
        where: {
            id: req.body.userID
        },
        data: {
            // newUserInfo
        }
    })

    return res.sendStatus(201)
})

app.get("/account/roles", async (req: Request, res: Response) => {
    // >>>  get all roles in company's role table

    //res: 200 and roles[] || 4xx

    const roles = await prisma.role.findMany({
        where: {
            // companyId: req.body.companyID
        }
    })
})

app.post("/account/roles", async (req: Request, res: Response) => {
    // req: newRoleParameters{roleName, role{}}

    // >>>  updates the roles in DB

    // res: 201 and roles[role{newParams}] || 4xx

    const updatedRole = await prisma.role.update({
        where: {
            name: req.body.role
        },
        data: {
            // req.body.newRoleParameters
        }
    })

    return res.sendStatus(200)
})

app.get("/account/equipment", (req: Request, res: Response): void => {
    // >>>  get all equipment types in company's equipment table

    //res: 200 and inventory[] || 4xx
})

app.post("/account/equipment", (req: Request, res: Response): void => {
    // req: changes[...newEquipmentInfo{equipment{name, description}}]

    // >>>  updates the equipment info in DB

    // res: 201 and allEquipment[] || 4xx
})

app.get("/account/fleet", async (req: Request, res: Response) => {
    // >>>  get all vehicles in company's fleet table

    //res: 200 and Fleet[] || 4xx

    const fleet = await prisma.fleet.findMany({
        where: {
            companyId: req.body.companyID
        }
    })

    return res.status(200).json(fleet)
})

app.post("/account/fleet", (req: Request, res: Response): void => {
    // req: changes[...newVehicleInfo{vehicle{uuid, truckName,}}]

    // >>>  updates the fleet/truck info in DB

    // res: 201 and Fleet[] || 4xx
})

app.get("/dashboard", async (req: Request, res: Response) => {
    // >>>  gets all the relavant data to populate the dashboard

    // res: dashboard{fleet{}}

    const fleet = await prisma.fleet.findMany({
        where: {
            companyId: req.body.companyID
        }
    })

    const vehicles = await prisma.truck.findMany({
        where: {
            Fleet: {
                companyId: req.body.companyId
            }
        }
    })

    const inventoryList = await prisma.truck.findMany({
        select: {
            inventory: {
                orderBy: {
                    date: 'desc'
                },
                take: 1
            }
        }
    })

    const maintenaceList = await prisma.truck.findMany({
        select: {
            maintenance: {
                orderBy: {
                    date: 'desc'
                },
                take: 1
            }
        }
    })

    return res.status(201).json({ fleet, vehicles, inventoryList, maintenaceList })
})

app.listen(PORT, (): void => {
    console.log(`Server Running >>> http://127.0.0.1:${PORT}`);
});