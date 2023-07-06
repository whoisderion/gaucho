require('dotenv').config();
import express, { Request, Response, Application } from 'express';

const app: Application = express();
const PORT = process.env.PORT

app.get("/", (req: Request, res: Response): void => {
    res.send("Gaucho Index")
});

app.post("/create-account", (req: Request, res: Response): void => {
    // req: company name, phone number, email, and password

    // >>>  Create a uuid for the company and attribute the copmany information 

    // res: 201 and cookie w/ company uuid || 4xx
})

app.post("/setup/fleet", (req: Request, res: Response): void => {
    // req: Trucks[{Truck Name, Liscense Plate, VIN#}, ...] and uuid cookie

    // >>>  Create a trucks table and then a uuid for each truck 
    // then attribute the information supplied to the table
    // then generate a url to attribute to the truck based off of its name

    // res: 201 and Trucks[...] || 4xx
})

app.post("/setup/inventory", (req: Request, res: Response): void => {
    // req: Trucks[{Truck Name, Equipment[Equipment 1, Equipment 2, ...Equipment n]}, ...]

    // >>>  Add the equipment information to the indivisual truck tables using the truck name to identify the uuid

    // res: 201 and Truks[Truck Name, Equipment[...]] || 4xx
})

app.get("/print-codes", (req: Request, res: Response): void => {
    // >>>  find all truck urls on the truck table and save to TruckURLs[{TruckName, TruckURL}]
    //client will generate the QR code

    // res: 200 and TruckURLs[] || 4xx
})

app.post("/upload/maintenance", (req: Request, res: Response): void => {
    // req: milage, oil level, coolant level, tire tread level, notes

    // >>>  create a uuid for the maintenance update, get the current date/time, save info to the update table

    // res: 200 and maintenance{} || 4xx
})

app.post("/upload/inventory", (req: Request, res: Response): void => {
    // req: maintenace{...{equipment 1, equipment 2, ...equipment n}}

    // >>>  save the inventory to maintenace{} in DB

    // res: 200 and maintenance{} || 4xx
})

app.post("/upload/pictures", (req: Request, res: Response): void => {
    // req: maintenance{...Photos{front:IMG_1653.jpg, back:IMG_1654.jpg, ...n:IMG_16nn}}

    // >>>  give each photo in maintenece{} a uuid
    // save photo to cloudinary w/ uuid

    // res: 200 and redirect to the success screen(?) || 4xx
})

app.get("/account/company", (req: Request, res: Response): void => {
    // >>>  get company email, address, notification settings

    // res: 200 and company{} || 4xx
})

app.post("/account/company", (req: Request, res: Response): void => {
    // req: newCompanyInfo{email}

    // >>>  update compnay info in DB

    // res: 201 and company{updatedInfo} || 4xx
})

app.get("/account/users", (req: Request, res: Response): void => {
    // >>>  get all users in company's user table

    //res: 200 and users[] || 4xx
})

app.post("/account/users", (req: Request, res: Response): void => {
    // req: newUserInfo{uuid, name}

    // >>>  updates the user's info in DB

    // res: 201 and users[user{updatedInfo}] || 4xx
})

app.get("/account/roles", (req: Request, res: Response): void => {
    // >>>  get all roles in company's role table

    //res: 200 and roles[] || 4xx
})

app.post("/account/roles", (req: Request, res: Response): void => {
    // req: newRoleParameters{roleName, role{}}

    // >>>  updates the roles in DB

    // res: 201 and roles[role{newParams}] || 4xx
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

app.get("/account/fleet", (req: Request, res: Response): void => {
    // >>>  get all vehicles in company's fleet table

    //res: 200 and Fleet[] || 4xx
})

app.post("/account/fleet", (req: Request, res: Response): void => {
    // req: changes[...newVehicleInfo{vehicle{uuid, truckName,}}]

    // >>>  updates the fleet/truck info in DB

    // res: 201 and Fleet[] || 4xx
})

app.get("/dashboard", (req: Request, res: Response): void => {
    // >>>  gets all the relavant data to populate the dashboard

    // res: dashboard{fleet{}}
})

app.listen(PORT, (): void => {
    console.log(`Server Running here 👉 http://127.0.0.1:${PORT}`);
});