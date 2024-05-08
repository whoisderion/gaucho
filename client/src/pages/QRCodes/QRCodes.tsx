import axios from "axios"
import { useState, useEffect, useRef } from "react"
import QRCode from "react-qr-code"
import { Button } from "@/components/ui/button"

function QRCodes({ closePrinting }: { closePrinting: () => void }) {
	// make a request for the qr codes for every truck

	// make a print all QRs function

	// make a print selected QR function

	const currCompanyID = import.meta.env.VITE_COMPANY_ID
	const [QRData, setQRData] = useState<{ url: string; name: string }[]>([])
	const qrCodeContainerRef = useRef<HTMLDivElement>(null)

	// fetch data
	useEffect(() => {
		const fetchData = async () => {
			try {
				await axios
					.get(
						`${
							import.meta.env.VITE_SERVER_URL
						}/print-qr-codes/${currCompanyID}`,
						{
							headers: {
								Accept: "application/json",
								"Content-Type": "application/json",
							},
						}
					)
					.then((res) => {
						setQRData(res.data)
						console.log(res.data)
					})
					.catch((e) => console.error(e))
			} catch (error) {
				console.log(error)
			}
		}

		fetchData()
	}, [])

	const handlePrint = () => {
		if (qrCodeContainerRef.current) {
			const qrCodeContainer = qrCodeContainerRef.current
			const popupWin = window.open("", "_blank", "width=800,height=800")
			if (popupWin) {
				popupWin.document.open()
				popupWin.document.write(`
                    <html>
                        <head>
                            <title>Print QR Code</title>
                            <style>
                                /* Add your custom styles for printing here */
                            </style>
                        </head>
                        <body onload="window.print();window.close()">
                            ${qrCodeContainer.innerHTML}
                        </body>
                    </html>
                `)
				popupWin.document.close()
			}
		}
	}

	console.log(QRData)

	const listQRCodes = QRData.map((vehicle, index) => (
		<div className=' block my-4' key={index}>
			<div className=' inline mx-auto mb-4' ref={qrCodeContainerRef}>
				<h3 className=' max-w-fit mx-auto'>{vehicle.name}</h3>
				<QRCode value={vehicle.url} className=' mx-auto my-2' />
			</div>

			{/* create a print dialog with "window.print" by making a new window object what had only the selected QR code */}
			<Button
				className='my-2 mx-auto block'
				onClick={() => {
					handlePrint()
				}}
			>
				Print
			</Button>
		</div>
	))

	return (
		// display the truck name, QR code, and a print button for every truck created
		<div className=' QR-Codes block mb-8 w-3/4 mx-auto'>
			<div>
				<h2>QR Codes</h2>
				<Button className='my-2' onClick={closePrinting}>
					Back
				</Button>
			</div>
			<div id='qr-codes-container' className=' grid grid-cols-2'>
				{listQRCodes}
			</div>
		</div>
	)
}
export default QRCodes
