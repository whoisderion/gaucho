require('dotenv').config();
import express, { Request, Response, Application } from 'express';
import { PrismaClient, Users, Role, Fleet, Truck, Equipment, Inventory, PhotoAreas } from '@prisma/client';
import cors from 'cors';
import QRCode from "qrcode";
import { Url } from 'url';
const cloudinary = require('cloudinary').v2

const app: Application = express();
const PORT = process.env.PORT;
const prisma = new PrismaClient();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const corsOptions = {
    origin: ['http://localhost', 'http://10.0.0.20', 'http://192.168.1.64', 'http://172.20.10.2', 'https://gaucho-client-production.up.railway.app'],
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}

app.set('json spaces', 4)
app.use(cors(corsOptions))
app.use(express.json({ limit: '50mb' }))

app.get("/", (req: Request, res: Response): void => {
    res.send("Gaucho Index");
});

type Group = {
    name: string,
    vehicles: Vehicle[]
    id: number
}

type Vehicle = {
    name: string,
    licensePlate: string,
    vinNumber: string,
    id: number,
    year?: number,
    equipment: { equipmentTypeID: number, quantity: number }[]
}

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

app.post("/setup/fleets", async (req: Request, res: Response) => {
    // req: Fleet[Trucks[{Truck Name, Liscense Plate, VIN#}, ...], Trucks[...]] and company id
    /* Fleet[{name: name, trucks: [Truck{...}, Truck{...}]},
            {name: name, trucks: [Truck{...}, Truck{...}]}] */

    // >>>  Create a trucks table and then a uuid for each truck 
    // then attribute the information supplied to the table
    // then generate a url to attribute to the truck based off of its name

    // res: 201 and Trucks[...] || 4xx


    try {
        const companyID = req.body.companyID
        const fleets: Group[] = req.body.fleets;

        type TruckData = {
            name: string,
            vin: string,
            license: string,
            year: number | null,
            fleetId: string,
            companyId: string
        }

        async function clearDB() {

            const clearEI = await prisma.equipmentInInventory.deleteMany({
                where: {
                    equipment: {
                        companyId: companyID
                    }
                }
            })

            const clearEquipment = await prisma.equipment.deleteMany({
                where: {
                    companyId: companyID
                }
            })

            const clearInventory = await prisma.inventory.deleteMany({
                where: {
                    Truck: {
                        companyId: companyID
                    }
                }
            })

            const clearVehicles = await prisma.truck.deleteMany({
                where: {
                    Fleet: {
                        companyId: companyID
                    }
                }
            })

            const clearFleets = await prisma.fleet.deleteMany({
                where: {
                    companyId: companyID
                }
            })

            console.log("fleet setup: fleets:", clearFleets.count + " vehicles:", clearVehicles.count + ", inventory:", clearInventory.count + ", equipment:", clearEquipment.count, "equipmentInventory:", clearEI.count)
        }

        await clearDB()

        const results: any[] = [];

        await Promise.all(fleets.map(async group => {

            let vehiclesToAdd: TruckData[] = []

            const fleet = await prisma.fleet.create({
                data: {
                    name: group.name,
                    companyId: companyID
                }
            })

            group.vehicles.forEach(vehicle => {
                vehiclesToAdd.push({
                    name: vehicle.name,
                    vin: vehicle.vinNumber,
                    license: vehicle.licensePlate,
                    year: (vehicle.year ? vehicle.year : null),
                    fleetId: fleet.id,
                    companyId: String(companyID),
                })
            })

            const data = await prisma.truck.createMany({
                data: vehiclesToAdd
            })

            results.push(data);

        }));

        return res.status(201).json(results)
    } catch (err) {
        console.log(err)
        return res.sendStatus(400)
    }

})

app.post("/setup/inventory", async (req: Request, res: Response) => {
    // req: Trucks[{Truck Name, Equipment[Equipment 1, Equipment 2, ...Equipment n]}, ...]

    // >>>  Add the equipment information to the indivisual truck tables using the truck name to identify the uuid

    // res: 201 and Truks[Truck Name, Equipment[...]] || 4xx

    const companyID: string = req.body.companyID

    const fleets: Group[] = req.body.fleets

    const equipmentTypes = req.body.equipmentTypes

    let inventory: {
        truckName: string,
        inventory: {
            [key: string]: any
        }
    }[] = []

    // add every truck's name and inventory to its respective fleet
    for (const fleet of fleets) {
        for (const vehicle of fleet.vehicles) {
            inventory.push({ "truckName": vehicle.name, inventory: vehicle.equipment })
        }
    }

    for await (const currTruck of inventory) {
        // get the truck that matches the current truck in the inventory
        const truck = await prisma.truck.findFirst({
            where: {
                name: currTruck.truckName
            }
        })

        async function createInventoryRecord() {
            // create an array of objects for the relation of each new inventory record to the existing equipment in the DB
            let inventoryUploadObj: any = []
            for (const [key, value] of Object.entries(currTruck.inventory)) {
                const currItemName = equipmentTypes.find((obj: { name: string, id: any; }) => obj.id === value.equipmentTypeID).name
                const currEquipment = await prisma.equipment.findFirst({
                    where: {
                        name: currItemName
                    }
                })

                inventoryUploadObj.push({
                    quantity: value.quantity,
                    equipment: {
                        connectOrCreate: {
                            where: {
                                id: currEquipment ? currEquipment.id : ""
                            },
                            create: {
                                name: currItemName,
                                companyId: companyID
                            }
                        }
                    }
                })
            }

            // create the inventory record for currTruck in the DB with Equipment[]
            const newInventory = await prisma.inventory.create({
                data: {
                    truckId: truck!.id,
                    equipmentItems: {
                        create: inventoryUploadObj,
                    },
                },
            })
        }
        await createInventoryRecord()

    };

    return res.sendStatus(201)
})

app.get("/print-qr-codes/:companyID", async (req: Request, res: Response) => {
    // req: companyID

    // >>>  find all truck urls on the truck table and save to TruckURLs[{TruckName, TruckURL}]
    //client will generate the QR code

    // res: 200 and TruckURLs[] || 4xx

    const companyID = req.params.companyID

    const dbTrucks = await prisma.truck.findMany({
        where: {
            Fleet: {
                companyId: {
                    equals: companyID,
                }
            }
        }
    });

    function createURLs(trucks: Truck[]): { url: string, name: string }[] {
        let URLs: { url: string, name: string }[] = []
        trucks.forEach(truck => {
            URLs.push({ url: `${process.env.CLIENT_URL}trucks/upload/${truck.id}`, name: truck.name })
        });
        return URLs;
    }
    const urlArr = createURLs(dbTrucks)

    res.status(201).json(urlArr)
})

app.get("/trucks/qr/:truckID", async (req: Request, res: Response) => {
    const truckID = req.params.truckID
    const generateQR = async () => {
        try {
            const imgURL = await QRCode.toDataURL(`${process.env.CLIENT_URL}trucks/${truckID}`)
            console.log(imgURL)
            res.write(imgURL)
        } catch (err) {
            console.error(err)
            res.sendStatus(204)
        }
    }
    return generateQR()
})

app.get("/account/equipment-complete/:companyId", async (req: Request, res: Response) => {
    // >>>  get all equipment types in company's equipment table

    //res: 200 and inventory[] || 4xx

    const companyID = req.params.companyId

    const currentDate = new Date();
    const oneDayAgo = new Date(Number(currentDate) - 1 * 24 * 60 * 60 * 1000);
    const threeDaysAgo = new Date(Number(currentDate) - 3 * 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(Number(currentDate) - 7 * 24 * 60 * 60 * 1000);
    const twoWeekAgo = new Date(Number(currentDate) - 14 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(Number(currentDate) - 30 * 24 * 60 * 60 * 1000);

    let timeframes = [
        { label: "oneDayAgo", value: oneDayAgo },
        { label: "threeDaysAgo", value: threeDaysAgo },
        { label: "oneWeekAgo", value: oneWeekAgo },
        { label: "twoWeeksAgo", value: twoWeekAgo },
        { label: "oneMonthAgo", value: oneMonthAgo }
    ]

    let equipmentData = []

    for (const date of timeframes) {
        const recentTruckInventories = await prisma.truck.findMany({
            where: {
                companyId: companyID,
            },
            select: {
                // id: true,
                name: true,
                inventory: {
                    where: {
                        date: {
                            gte: date.value
                        },
                    },
                    select: {
                        equipmentItems: {
                            select: {
                                equipment: {
                                    select: {
                                        name: true
                                    }
                                },
                                quantity: true,
                            },
                        },
                        date: true,
                    },
                },
            },
        });

        equipmentData.push({
            label: date.label,
            inventoryRecord: recentTruckInventories
        })
    }

    res.status(200).json(equipmentData)
})

app.get("/account/fleet/:companyID", async (req: Request, res: Response) => {
    const companyID = req.params.companyID

    const vehicles = await prisma.truck.findMany({
        where: { companyId: companyID },
        select: {
            name: true,
            vin: true,
            license: true,
            year: true,
            id: true,
            Fleet: {
                select: {
                    name: true,
                    id: true
                }
            }
        }
    })

    const fleets = await prisma.fleet.findMany({
        where: { companyId: companyID },
        select: { id: true, name: true }
    })

    res.status(200).json({
        vehicles: vehicles,
        fleets: fleets
    })

})

app.get("/upload/equipment-fields/:companyID", async (req: Request, res: Response) => {
    const companyID = req.params.companyID
    try {
        const equipmentFields = await prisma.equipment.findMany({
            where: {
                companyId: companyID
            },
        })
        // console.log(equipmentFields)
        return res.status(200).json({ equipmentFields })
    } catch (error) {
        console.error(error)
        return res.sendStatus(400)
    }
})

app.post("/upload/complete", async (req: Request, res: Response) => {
    type uploadData = {
        maintenance: {
            mileage: number,
            oil: string,
            coolant: string,
            frontDriverTread: string,
            frontPassengerTread: string,
            rearDriverTread: string,
            rearPassengerTread: string,
            notes: string
        },
        equipment: {
            name: { id: string, quantity: number }
        },
        pictures: {}
    }
    const data: uploadData = req.body.formData
    const truckID = req.body.truckID

    try {
        const maintenanceUpdate = await prisma.maintenance.create({
            data: {
                truckId: truckID,
                mileage: Number(data.maintenance.mileage) ?? undefined,
                oil: data.maintenance.oil ?? undefined,
                coolant: data.maintenance.coolant ?? undefined,
                frontDriverTread: String(data.maintenance.frontDriverTread) ?? undefined,
                frontPassengerTread: String(data.maintenance.frontPassengerTread) ?? undefined,
                rearDriverTread: String(data.maintenance.rearDriverTread) ?? undefined,
                rearPassengerTread: String(data.maintenance.rearPassengerTread) ?? undefined,
                notes: data.maintenance.notes ?? undefined
            }
        });

        //create an object for the equipment in the inventory update
        let equipmentItems = []
        for (const [equipmentName, equipmentValues] of Object.entries(data.equipment)) {
            equipmentItems.push({ quantity: equipmentValues.quantity, equipmentId: equipmentValues.id })
        }

        const inventoryUpdate = await prisma.inventory.create({
            data: {
                truckId: truckID,
                equipmentItems: {
                    createMany: {
                        data: equipmentItems
                    }
                }
            }
        })

        console.log(data.pictures + '\n')

        let cloudinaryAssetID: string
        let cloudinaryURL: Url
        let cloudinarySecureURL: Url

        const uploadedResponse = await cloudinary.uploader.upload(data.pictures, {
            upload_preset: 'gaucho_update'
        })

        cloudinaryURL = uploadedResponse.asset_id
        cloudinaryAssetID = uploadedResponse.url
        cloudinarySecureURL = uploadedResponse.secure_url
        console.log(cloudinaryURL, cloudinaryAssetID, cloudinarySecureURL)

        res.sendStatus(200)

    } catch (error) {
        console.error(error)
        res.sendStatus(400)
    }
})

app.get("/account/company/:companyID", async (req: Request, res: Response) => {
    // req: companyID

    // >>>  get company email, address, notification settings

    // res: 200 and company{} || 4xx

    const companyID = req.params.companyID as string

    const company = await prisma.company.findUnique({
        where: {
            id: companyID
        }
    })

    return res.status(200).json(company)
})

app.get("/account/company/photo-areas/:companyID", async (req: Request, res: Response) => {
    const companyID = req.params.companyID

    try {
        const photoAreas = await prisma.photoAreas.findMany({
            where: {
                companyId: companyID
            },
            select: {
                name: true,
                id: true,
                companyId: true,
                position: true,
            },
            orderBy: {
                position: 'asc'
            }
        })

        const photoAreasArr = new Array()

        photoAreas.forEach(area => {
            photoAreasArr.push({ id: area.id, name: area.name, companyID: area.companyId, position: area.position })
        })

        res.status(201).json(photoAreasArr)
    } catch (error) {
        console.error(error)
        res.sendStatus(400)
    }
})

app.post("/account/company/photo-areas", async (req: Request, res: Response) => {
    const photoAreasArr = req.body.tempPhotoAreas
    const companyId = req.body.companyId
    const areasToDelete = req.body.areasToDelete
    try {
        const updatedPhotoAreas = await Promise.all(photoAreasArr.map(async (area: PhotoAreas) => {
            const updatedArea = await prisma.photoAreas.upsert({
                where: {
                    id: area.id,
                },
                update: {
                    name: area.name,
                    position: area.position
                },
                create: {
                    name: area.name,
                    companyId: companyId,
                    position: area.position,
                },
            })

            return updatedArea
        }))

        const deletedPhotoAreas = await prisma.photoAreas.deleteMany({
            where: {
                id: {
                    in: areasToDelete
                }
            }
        })

        res.status(201).json(photoAreasArr)

    } catch (error) {
        console.error(error)
        res.sendStatus(400)
    }
})

// // app.post("/account/company", async (req: Request, res: Response) => {
// //     // req: newCompanyInfo{email}

// //     // >>>  update compnay info in DB

// //     // res: 201 and company{updatedInfo} || 4xx

// //     const company = await prisma.company.update({
// //         where: {
// //             id: req.body.companyID,
// //         },
// //         data: req.body.data
// //     })

// //     return res.status(200).json(company)
// // })

// // app.get("/account/users", async (req: Request, res: Response) => {
// //     // >>>  get all users in company's user table

// //     //res: 200 and users[] || 4xx

// //     const users = await prisma.users.findMany({
// //         where: {
// //             companyId: req.body.companyId
// //         }
// //     })

// //     return res.status(200).json(users)
// // })

// // app.post("/account/users", async (req: Request, res: Response) => {
// //     // req: newUserInfo{uuid, name}

// //     // >>>  updates the user's info in DB

// //     // res: 201 and users[user{updatedInfo}] || 4xx

// //     let users: Users[] = []

// //     for (const user of req.body.users) {
// //         const updatedUser = await prisma.users.update({
// //             where: {
// //                 id: user.id
// //             },
// //             data: user
// //         })
// //         users.push(updatedUser)
// //     }

// //     return res.status(201).json(users)
// // })

// // // TODO: delete user

// // app.get("/account/roles", async (req: Request, res: Response) => {
// //     // >>>  get all roles in company's role table

// //     //res: 200 and roles[] || 4xx

// //     const roles = await prisma.role.findMany({
// //         where: {
// //             companyId: req.body.companyID
// //         }
// //     })

// //     res.status(200).json(roles)
// // })

// // app.post("/account/roles", async (req: Request, res: Response) => {
// //     // req: newRoleParameters{roleName, role{}}

// //     // >>>  updates the roles in DB

// //     // res: 201 and roles[role{newParams}] || 4xx

// //     const roles: Role[] = req.body.roles
// //     let updatedRoles: Role[] = []
// //     for (const role of roles) {
// //         const updatedRole = await prisma.role.upsert({
// //             where: {
// //                 name: role.name
// //             },
// //             update: {
// //                 name: role.name
// //             },
// //             create: {
// //                 name: role.name,
// //                 companyId: req.body.companyID
// //             }
// //         })
// //         updatedRoles.push(updatedRole)
// //     }

// //     return res.status(201).json(updatedRoles)
// // })

// // TODO: delete role

// // OLD POST VERB

// // app.get("/account/equipment", async (req: Request, res: Response) => {
// //     // req: changes[...newEquipmentInfo{equipment{name, description}}]

// //     // >>>  updates the equipment info in DB

// //     // res: 201 and allEquipment[] || 4xx

// //     const equipment = req.body.equipment

// //     let updatedEquipment: Equipment[] = []

// //     for (const item of equipment) {
// //         const upsertedItem = await prisma.equipment.upsert({
// //             where: {
// //                 id: item.id || ""
// //             },
// //             update: {
// //                 name: item.name
// //             },
// //             create: {
// //                 name: item.name,
// //                 companyId: req.body.companyID
// //             }
// //         })
// //         updatedEquipment.push(upsertedItem)
// //     }

// //     res.status(201).json(updatedEquipment)
// // })

// // TODO: delete equipment

app.post("/account/vehicle", async (req: Request, res: Response) => {
    // req: changes[...newVehicleInfo{vehicle{uuid, truckName,}}]

    // >>>  updates the fleet/p info in DB

    // res: 201 and Fleet[] || 4xx

    type VehicleData = {
        name: string,
        vin: string,
        license: string,
        year: number,
        id: string,
        fleet: string
        Fleet: {
            name: string,
            id: string
        }
    }

    const vehicleData: VehicleData = req.body
    const { fleet, ...prismaData } = vehicleData

    try {
        const updatedVehicle = await prisma.truck.update({
            where: {
                id: prismaData.id,
            },
            data: {
                ...prismaData,
                Fleet: {
                    connect: {
                        id: prismaData.Fleet.id
                    }
                }
            }
        })
        console.log(updatedVehicle)
        res.status(200).json(updatedVehicle)
    } catch (error) {
        console.error(error)
        res.status(400)
    }

})
app.post("/account/fleet", async (req: Request, res: Response) => {
    interface RequestBody {
        tempFleets: Fleet[]
        fleetsToDelete: string[]
        companyId: string
    }
    const { tempFleets, fleetsToDelete, companyId }: RequestBody = req.body
    try {
        const updatedFleets = await Promise.all(tempFleets.map(async (fleet: Fleet) => {
            const updatedFleet = await prisma.fleet.upsert({
                where: {
                    id: fleet.id
                },
                update: {
                    name: fleet.name
                },
                create: {
                    name: fleet.name,
                    companyId: companyId
                }
            })
        }))

        const deletedFleets = await prisma.fleet.deleteMany({
            where: {
                id: {
                    in: fleetsToDelete
                }
            }
        })

        res.status(200).json(tempFleets)
    } catch (error) {
        console.error(error)
        res.sendStatus(400)
    }
})


app.get("/dashboard", async (req: Request, res: Response) => {
    // >>>  gets all the relavant data to populate the dashboard

    // res: dashboard{fleet{}}
    // note: redundant IDs will be kept for sanity checks/easier debugging

    type DashboardVehicle = {
        id: string,
        name: string,
        vin: string,
        license: string,
        year: number,
        urlPath: string,
        fleetId: string,
        inventory?: {},
        lastInventory?: {}
        maintenance?: {},
    }

    type DashboardFleet = {
        id: string,
        name: string,
        companyId: string,
        vehicles: DashboardVehicle[]
    }[]

    // returns an array of fleets that the company have created
    const fleet = await prisma.fleet.findMany({
        where: {
            companyId: req.body.companyID
        }
    })

    // returns an array of vehicles belonging to the company
    const vehicles = await prisma.truck.findMany({
        where: {
            Fleet: {
                companyId: req.body.companyId
            }
        }
    })

    // returns an object each truck's most recent inventory update
    const inventoryList = await prisma.truck.findMany({
        select: {
            inventory: {
                orderBy: {
                    date: 'desc'
                },
                take: 4,
                include: {
                    equipmentItems: {
                        include: {
                            equipment: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    }
                }
            }
        }
    })

    // returns an object for each truck's most recent maintenace update
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

    let dashboardData: any = fleet

    // add each vehicle to their respective fleet
    for (const vehicle of vehicles as DashboardVehicle[]) {
        const currFleetIndex = dashboardData.findIndex((currentFleet: Fleet) => currentFleet.id === vehicle.fleetId)
        if (!dashboardData[currFleetIndex].vehicles) {
            dashboardData[currFleetIndex].vehicles = []
        }

        vehicle.inventory = {}
        vehicle.maintenance = {}
        vehicle.lastInventory = {}
        dashboardData[currFleetIndex].vehicles.push(vehicle)
    }

    // add each inventory to its respective truck 
    // (the location will be similar to a 2D array [Fleet][Vehicle])

    // both this and the equipment array can be optimized but this is unecessary due the... 
    // largest expected company having less than 30 vehicles but would need to be optimized
    // for enterprise companies
    for (const inventory of inventoryList) {
        const currInventory = inventory.inventory[0]
        if (currInventory) {
            for (let fleetIndex = 0; fleetIndex < dashboardData.length; fleetIndex++) {
                // checks if the current fleet has a vehicle array AND that the current inventory's vehicle is in the current fleet
                // then adds the the inventory to the curernt vehicle
                if (dashboardData[fleetIndex].vehicles && dashboardData[fleetIndex].vehicles.findIndex((vehiclesToAdd: Truck) => vehiclesToAdd.id === currInventory.truckId) != -1) {
                    const vehicleIndex = dashboardData[fleetIndex].vehicles.findIndex((vehiclesToAdd: Truck) => vehiclesToAdd.id === currInventory.truckId)
                    dashboardData[fleetIndex].vehicles[vehicleIndex].inventory = currInventory
                    // checks to see if there is a last inventory that is not empty
                    // then adds it to the vehicles last inventory property
                    // TODO: add a function that checks for older inventories if there is an empty lastInventory
                    if (inventory.inventory[1] && inventory.inventory[1].equipmentItems.length != 0) {
                        dashboardData[fleetIndex].vehicles[vehicleIndex].lastInventory = inventory.inventory[1]
                    }
                }
            }
        }
    }

    // add each maintenance update to its respectice truck
    // this will also be a 2D array similar to adding the inventory
    for (const maintenace of maintenaceList) {
        const currMaintenance = maintenace.maintenance[0]
        if (currMaintenance) {
            for (let fleetIndex = 0; fleetIndex < dashboardData.length; fleetIndex++) {
                // checks if the current fleet has a vehicle array AND that the current maintenance's vehicle is in the fleet
                // then it add the current maintenance to the vehicles maintenance property
                if (dashboardData[fleetIndex].vehicles && dashboardData[fleetIndex].vehicles.findIndex((vehiclesToAdd: Truck) => vehiclesToAdd.id === currMaintenance.truckId) != -1) {
                    const vehicleIndex = dashboardData[fleetIndex].vehicles.findIndex((vehiclesToAdd: Truck) => vehiclesToAdd.id === currMaintenance.truckId)
                    dashboardData[fleetIndex].vehicles[vehicleIndex].maintenance = currMaintenance
                }
            }
        }
    }

    // console.log("Completed Dashboard Data...")
    // console.log(util.inspect(dashboardData, false, null, true))
    // console.log("\n")

    return res.status(201).json({ "fleets": dashboardData })
})

app.listen(PORT, (): void => {
    console.log(`Server Running >>> http://127.0.0.1:${PORT}`);
});