import axios from "axios"

const serverURL = import.meta.env.VITE_SERVER_URL
const companyId = import.meta.env.VITE_COMPANY_ID

const handleInputChange = (e: React.ChangeEvent<HTMLElement>, setFormData: React.Dispatch<React.SetStateAction<any>>, section: string) => {
    const { name, value, type } = e.target as HTMLInputElement
    const isEquipment = section === 'equipment'
    setFormData((previousFormData) => ({
        ...previousFormData,
        [section]: {
            ...previousFormData[section],
            ...(isEquipment ?
                {
                    [name]: {
                        ...previousFormData[section][name],
                        quantity: Number(value)
                    }
                } :
                {
                    [name]: type === 'checkbox'
                        ? (e.target as HTMLInputElement).checked
                        : value
                })
        }
    }))
}

const handleSubmit = async (e: React.FormEvent, formData: any, previewSource) => {
    e.preventDefault()
    if (previewSource) {
        formData = { ...formData, pictures: previewSource }
    }
    console.log(formData)
    const pathArray = window.location.pathname.split('/')
    const truckID = pathArray[pathArray.length - 1]

    const uploadUpdate = await axios.post(`${import.meta.env.VITE_SERVER_URL}upload/complete`, {
        formData: formData,
        truckID: truckID,
        companyID: import.meta.env.VITE_COMPANY_ID
    })

    return (uploadUpdate)
}

const handleFileInputChange = (e, setPreviewSource) => {
    const file = e.target.files[0]
    previewFile(file, setPreviewSource)
}

const previewFile = (file, setPreviewSource) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
        setPreviewSource(reader.result)
    }
}

function UploadMaintenace({ setUploadingMaintenance, setUploadingInventory, formData, setFormData }: {
    setUploadingMaintenance: React.Dispatch<React.SetStateAction<boolean>>,
    setUploadingInventory: React.Dispatch<React.SetStateAction<boolean>>,
    formData: any
    setFormData: React.Dispatch<React.SetStateAction<any>>
}) {
    return (
        <div className="Contents">
            <div className=" max-w-lg border mx-auto px-20 py-7 text-center">
                <h2>Upload Maintenance</h2>
                <div className=" text-left mb-8">
                    <form className="maintenance flex flex-col space-y-2">
                        <div className="mileage mx-auto">
                            <label htmlFor="mileage">Mileage</label>
                            <input
                                type="number"
                                // inputMode="numeric"
                                // pattern="[0-9]+"
                                name="mileage"
                                value={formData.maintenance.mileage || ''}
                                onChange={(e) => handleInputChange(e, setFormData, 'maintenance')}
                                autoComplete="off" />
                        </div>
                        <div className="oil mx-auto">
                            <label htmlFor="oil">Oil</label>
                            <input
                                type="text"
                                name="oil"
                                value={formData.maintenance.oil || ''}
                                onChange={(e) => handleInputChange(e, setFormData, 'maintenance')}
                                autoComplete="off" />
                        </div>
                        <div className="coolant mx-auto">
                            <label htmlFor="coolant">Coolant</label>
                            <input
                                type="text"
                                name="coolant"
                                value={formData.maintenance.coolant || ''}
                                onChange={(e) => handleInputChange(e, setFormData, 'maintenance')}
                                autoComplete="off" />
                        </div>
                        <div className="tire-tread mx-auto">
                            <label htmlFor="rearPassengerTread">Front Driver Tread</label>
                            <input
                                type="checkbox"
                                name="frontDriverTread"
                                checked={formData.maintenance.frontDriverTread || false}
                                onChange={(e) => handleInputChange(e, setFormData, 'maintenance')} />
                            <label htmlFor="frontPassengerTread">Front Passenger Tread</label>
                            <input
                                type="checkbox"
                                name="frontPassengerTread"
                                checked={formData.maintenance.frontPassengerTread || false}
                                onChange={(e) => handleInputChange(e, setFormData, 'maintenance')} />
                            <label htmlFor="rearDriverTread">Rear Driver Tread</label>
                            <input
                                type="checkbox"
                                name="rearDriverTread"
                                checked={formData.maintenance.rearDriverTread || false}
                                onChange={(e) => handleInputChange(e, setFormData, 'maintenance')} />
                            <label htmlFor="rearPassengerTread">Rear Passenger Tread</label>
                            <input
                                type="checkbox"
                                name="rearPassengerTread"
                                checked={formData.maintenance.rearPassengerTread || false}
                                onChange={(e) => handleInputChange(e, setFormData, 'maintenance')} />
                        </div>
                        <div className="notes mx-auto">
                            <label htmlFor="notes">Notes</label>
                            <input
                                type="text"
                                name="notes"
                                value={formData.maintenance.notes || ''}
                                onChange={(e) => handleInputChange(e, setFormData, 'maintenance')}
                                autoComplete="off" />
                        </div>
                    </form>
                </div>
                <button onClick={() => {
                    setUploadingInventory(true)
                    setUploadingMaintenance(false)
                }}>Continue</button>
            </div>
        </div>
    )
}

function UploadInventory({ formData, setFormData, equipmentFields, setUploadingMaintenance, setUploadingInventory, setUploadingPictures }: {
    formData: any
    setUploadingMaintenance: React.Dispatch<React.SetStateAction<boolean>>,
    setUploadingInventory: React.Dispatch<React.SetStateAction<boolean>>,
    setUploadingPictures: React.Dispatch<React.SetStateAction<boolean>>,
    setFormData: React.Dispatch<React.SetStateAction<any>>
    equipmentFields: any
}) {
    handleSubmit
    return (
        <div className="Contents">
            <div className=" max-w-lg border mx-auto px-20 py-7 text-center ">
                <h2>Upload Inventory</h2>
                <div className=" text-left mb-8">
                    <form className=" flex flex-col space-y-2">
                        {
                            equipmentFields.map((equipment: { name: string, id: string }, index: string) => {
                                return (
                                    <div key={index} className="mx-auto">
                                        <label htmlFor={equipment.name}>{equipment.name}</label>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9]+"
                                            name={equipment.name}
                                            value={formData.equipment[equipment.name].quantity || ''}
                                            onChange={(e) => handleInputChange(e, setFormData, 'equipment')}
                                            autoComplete="off" />
                                    </div>
                                )
                            })
                        }
                    </form>
                </div>
                <div className=" space-x-6">
                    <button
                        onClick={() => {
                            setUploadingMaintenance(true)
                            setUploadingInventory(false)
                        }}>
                        Back</button>
                    <button
                        onClick={() => {
                            setUploadingPictures(true)
                            setUploadingInventory(false)
                        }}>
                        Continue</button>
                </div>
            </div>
        </div>
    )
}

function UploadPictures({ formData, setUploadingInventory, setUploadingPictures, previewSource, setPreviewSource }: {
    formData: any,
    setUploadingInventory: React.Dispatch<React.SetStateAction<boolean>>,
    setUploadingPictures: React.Dispatch<React.SetStateAction<boolean>>,
}) {
    return (
        <div className="Contents">
            <div className=" max-w-lg border mx-auto px-20 py-7 text-center ">
                <h2>Upload Pictures</h2>
                <div>
                    This has yet to be implemented ¯\_(ツ)_/¯
                    <input
                        type="file"
                        name="photo1"
                        id=""
                        accept="image/*"
                        value={formData.Pictures}
                        onChange={(e) => { handleFileInputChange(e, setPreviewSource) }} />
                    {previewSource && (
                        <div className="mt-6">
                            <p>Preview</p>
                            <img src={previewSource} alt="" />
                        </div>
                    )}
                </div>
                <div className=" space-x-6">
                    <button onClick={() => {
                        setUploadingInventory(true)
                        setUploadingPictures(false)
                    }}>Back</button>
                    <button
                        onClick={(e) => { handleSubmit(e, formData, previewSource) }}>Submit</button>
                </div>
            </div>
        </div>
    )
}

type uploadFormData = {
    maintenance: {
        mileage: number,
        oil: string,
        coolant: string,
        frontDriverTread: string,
        frontPassengerTread: string,
        rearDriverTread: string,
        rearPassengerTread: string,
        notes: string,
    },
    equipment: { name: string, id: string, quantity: string }[],
    photos: {}
}

function Upload() {

    const [uploadingMaintenance, setUploadingMaintenance] = useState(true)
    const [uploadingInventory, setUploadingInventory] = useState(false)
    const [uploadingPictures, setUploadingPictures] = useState(false)
    const [equipmentFields, setEquipmentFields] = useState<any>([])
    const [previewSource, setPreviewSource] = useState()
    const [formData, setFormData] = useState({
        maintenance: {
            mileage: null,
            oil: null,
            coolant: null,
            frontDriverTread: null,
            frontPassengerTread: null,
            rearDriverTread: null,
            rearPassengerTread: null,
            notes: null,
        },
        equipment: {},
        photos: {}
    })

    type EquipmentType = {
        id: string,
        name: string,
        companyId: string
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${serverURL}upload/equipment-fields/${companyId}`)
                    acc[obj.name] = {
                        id: obj.id,
                        quantity: null
                    }
                    return acc
                }, {})
                setFormData(prevFormData => ({
                    ...prevFormData,
                    equipment: newEquipmentObj
                }))
            } catch (err) {
                console.error(err)
            }
        }

        fetchData()
    }, [])

    if (uploadingMaintenance) {
        return (
            <UploadMaintenace
                setUploadingMaintenance={setUploadingMaintenance}
                setUploadingInventory={setUploadingInventory}
                formData={formData}
                setFormData={setFormData} />
        )
    } else if (uploadingInventory) {
        console.log(formData)
        return (
            <UploadInventory
                equipmentFields={equipmentFields}
                setUploadingMaintenance={setUploadingMaintenance}
                setUploadingInventory={setUploadingInventory}
                setUploadingPictures={setUploadingPictures}
                formData={formData}
                setFormData={setFormData} />
        )
    } else if (uploadingPictures) {
        return (
            <UploadPictures
                setUploadingInventory={setUploadingInventory}
                setUploadingPictures={setUploadingPictures}
                formData={formData}
                previewSource={previewSource}
                setPreviewSource={setPreviewSource} />
        )
    }
}

export default Upload