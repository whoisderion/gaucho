function CreateFleet() {

    function createNewFleet() {
        return (
            <>
                <div>
                    <form action="">
                        <div>
                            <p>Truck Name</p>
                            <input type="text" name="truck-name" id="" />
                        </div>
                        <div>
                            <p>Liscense Plate</p>
                            <input type="text" name="liscense-plate" id="" />
                        </div>
                        <div>
                            <p>VIN Number</p>
                            <input type="text" name="vin-number" id="" />
                        </div>
                    </form>
                </div>
                <div id="other-vehicles">

                </div>
                <div id="add-another-vehicle">

                </div>
            </>
        )
    }

    function displayFleets() {
        return (
            <>

            </>
        )
    }


    // const FleetForm = 

    return (
        <div>
            <div>
                <h1>Fleet</h1>
                <button onClick={createNewFleet}>+ Create Fleet</button>
                <hr />
                {displayFleets()}
            </div>
            <div id="current-fleet">

            </div>
        </div>
    )
}

export default CreateFleet