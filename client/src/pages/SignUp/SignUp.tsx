import { useNavigate } from "react-router-dom"
import * as ROUTES from "data/routes"
import axios from "axios"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"

const phoneRegex = new RegExp(
	/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
)

const formSchema = z.object({
	companyName: z
		.string()
		.min(4, { message: "Must be 4 or more characters long" })
		.max(50, { message: "Must be 50 or fewer characters long" }),
	companyEmail: z.string().email({ message: "Invalid email address" }),
	phoneNumber: z
		.string()
		.regex(phoneRegex, "Invalid Phone Number!")
		.length(10, { message: "Please enter a 10 digit phone number" }),
})

function SignUp() {
	const navigate = useNavigate()

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			companyName: "",
			companyEmail: "",
			phoneNumber: "",
		},
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values)

		await axios.post(`${import.meta.env.VITE_SERVER_URL}/create-account`, {
			companyName: values.companyName,
			email: values.companyEmail,
			phoneNumber: values.phoneNumber,
		})

		return navigate(ROUTES.CREATE_FLEET)
	}

	return (
		<div className=' flex justify-center items-center bg-secondary h-full'>
			<Card className=' max-w-xl mx-auto  md:w-1/3'>
				<CardHeader>
					<CardTitle>Sign Up for Gaucho</CardTitle>
				</CardHeader>
				<CardContent className=' px-10'>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className=' space-y-4'>
							<FormField
								control={form.control}
								name='companyName'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Company Name</FormLabel>
										<FormControl>
											<Input placeholder='ACME Co.' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='phoneNumber'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Company Phone Number</FormLabel>
										<FormControl>
											<Input placeholder='123-456-7890' {...field} />
										</FormControl>
										<FormDescription>10 digit phone number</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='companyEmail'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Company Email</FormLabel>
										<FormControl>
											<Input placeholder='comapny@email.com' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type='submit' className=' bg-primary'>
								Continue
							</Button>
						</form>
					</Form>
				</CardContent>
				<CardFooter></CardFooter>
			</Card>
		</div>
	)
}

export default SignUp
