import { Link } from "react-router-dom"
import * as ROUTES from "data/routes"
import { Button } from "@/components/ui/button"
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion"
import { default as Wave } from "assets/wave-haikei.svg"
import { default as Image } from "assets/feature_1.jpeg"
import { Check, X } from "lucide-react"

const Video =
	"https://stafvkxufrwikaopaoom.supabase.co/storage/v1/object/sign/website-assets/test%20trimmed.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ3ZWJzaXRlLWFzc2V0cy90ZXN0IHRyaW1tZWQubXA0IiwiaWF0IjoxNzE1MjA1NDc2LCJleHAiOjE3NDY3NDE0NzZ9.7Q-ZQdfxY50U3I7hGHGTLdhJo_zBbGJ9mEUEB0mw4Dc&t=2024-05-08T21%3A57%3A56.438Z"

function Landing() {
	return (
		<div className='Landing w-full'>
			<section
				id='hero'
				className=' flex flex-col relative w-full overflow-hidden'
			>
				<div className='hero-bg md:block absolute inset-0 z-0'>
					<div className='bg-black absolute inset-0 opacity-40 z-[1]'></div>
					<video
						src={Video}
						autoPlay={true}
						loop={true}
						muted={true}
						role='banner'
						className=' absolute inset-0 object-cover h-full w-full pb-2'
					/>
				</div>
				<nav className='sign-buttons relative max-w-5xl flex items-center justify-between px-8 py-4 mx-auto text-white w-full'>
					<div className=' flex lg:flex-1 font-black text-lg'>
						<a href='/'>Gaucho</a>
					</div>
					<div className=' flex flex-row lg:justify-center gap-7 lg:gap-12 lg:items-center'>
						<div className=' hover:underline'>
							<a href='#pricing'>Pricing</a>
						</div>
						<div className=' hover:underline'>
							<a href='#faq'>FAQ</a>
						</div>
					</div>
					<div className=' flex lg:justify-end lg:flex-1 '>
						<Link className='hover:underline' to={ROUTES.SIGN_IN}>
							Log In
						</Link>
					</div>
				</nav>
				<div className='hero-container z-10 relative flex flex-col items-center justify-center mx-auto max-w-5xl gap-16 lg:gap-20 px-8 py-12 lg:py-32 md:text-white'>
					<div className='text flex flex-col gap-10 items-center justify-center text-center '>
						<h1 className=' font-extrabold text-4xl lg:text-6xl tracking-tight text-white -mb-4'>
							Stop the stampede
							<br /> and get your fleet organized
						</h1>
						<p className=' text-lg leading-relaxed max-w-md mx-auto font-semibold text-white'>
							Optimize your operations, improve efficiency, and streamline your
							operations with Gaucho Inventory.
						</p>
					</div>
					<div className='cta w-52 my-auto space-y-2'>
						<Button className=' w-full bg-primary'>
							<Link to={ROUTES.SIGN_UP} className=' px-14 py-3'>
								Get Gaucho →
							</Link>
						</Button>
					</div>
				</div>
				<div className='wave relative w-full -mb-1'>
					<img src={Wave} alt='' className='w-full' />
				</div>
			</section>
			<section id='before-after'>
				<div className=' py-24 px-8 max-w-7xl mx-auto '>
					<h2 className=' text-center border-b-0 font-extrabold text-4xl md:text-5xl tracking-tight mb-12 md:mb-20 md:max-w-2xl mx-auto'>
						Tired of untimely breakdowns and lost equipment?
					</h2>
					<div
						id='before-after-cards'
						className='flex flex-col md:flex-row justify-center items-center md:items-start gap-8 md:gap-12'
					>
						<div className=' bg-rose-100/50 text-rose-700 p-8 md:p-12 rounded-lg w-full max-w-md'>
							<h3 className=' font-bold text-lg mb-4'>
								Fleet management without Gaucho
							</h3>
							<ul className=' list-disc list-inside space-y-1.5 font-medium'>
								<li className='flex gap-2 items-center'>
									<X className=' w-4' strokeWidth={2.5} /> Hard to maintain
									spreadsheets
								</li>
								<li className='flex gap-2 items-center'>
									<X className=' w-4' strokeWidth={2.5} /> Missing records and
									unreliable data
								</li>
								<li className='flex gap-2 items-center'>
									<X className=' w-4' strokeWidth={2.5} /> Unexpected breakdowns
									on the road
								</li>
								<li className='flex gap-2 items-center'>
									<X className=' w-4' strokeWidth={2.5} /> Unclear maintenace
									records
								</li>
								<li className='flex gap-2 items-center'>
									<X className=' w-4' strokeWidth={2.5} /> Buying lost equipment
								</li>
							</ul>
						</div>
						<div className='bg-emerald-100/70 text-emerald-700 p-8 md:p-12 rounded-lg w-full max-w-md'>
							<h3 className=' font-bold text-lg mb-4'>
								Fleet management + Gaucho
							</h3>
							<ul className=' list-disc list-inside space-y-1.5 font-medium'>
								<li className='flex gap-2 items-center'>
									<Check className='w-4' strokeWidth={2.5} />
									Eliminate operational downtime
								</li>
								<li className='flex gap-2 items-center'>
									<Check className='w-4' strokeWidth={2.5} />
									Avoid expensive service fees
								</li>
								<li className='flex gap-2 items-center'>
									<Check className='w-4' strokeWidth={2.5} />
									Spend less on lost equipment
								</li>
								<li className='flex gap-2 items-center'>
									<Check className='w-4' strokeWidth={2.5} />
									Alerts for maintenace requests
								</li>
								<li className='flex gap-2 items-center'>
									<Check className='w-4' strokeWidth={2.5} />
									Toss out your paper forms
								</li>
							</ul>
						</div>
					</div>
				</div>
			</section>
			<section
				id='workflow'
				className='py-24 md:py-32 space-y-24 md:space-y-32 max-w-5xl mx-auto bg-base-100 '
			>
				<div className=' px-8'>
					<h2 className='border-b-0 font-extrabold text-4xl px-8 lg:text-5xl tracking-tight mb-12 md:mb-24 '>
						Reliably track resource usage
					</h2>
					<div className=' grid grid-cols-1 items-stretch gap-8 px-8 sm:gap-12 lg:grid-cols-2 lg:gap-24'>
						<Accordion
							type='single'
							collapsible
							className='w-full'
							defaultValue='item-1'
						>
							<AccordionItem value='item-1' className='text-base font-semibold'>
								<AccordionTrigger className=' data-[state=open]:text-primary hover:no-underline text-base font-semibold md:text-lg'>
									Is it accessible?
								</AccordionTrigger>
								<AccordionContent className=' leading-relaxed opacity-1 text-slate-700 text-base font-semibold'>
									Yes. It adheres to the WAI-ARIA design pattern.
								</AccordionContent>
							</AccordionItem>
							<AccordionItem value='item-2'>
								<AccordionTrigger className=' data-[state=open]:text-primary hover:no-underline text-base font-semibold md:text-lg'>
									Is it styled?
								</AccordionTrigger>
								<AccordionContent className=' leading-relaxed opacity-1 text-slate-700 text-base font-semibold'>
									Yes. It comes with default styles that matches the other
									components&apos; aesthetic.
								</AccordionContent>
							</AccordionItem>
							<AccordionItem value='item-3'>
								<AccordionTrigger className=' data-[state=open]:text-primary hover:no-underline text-base font-semibold md:text-lg'>
									Is it animated?
								</AccordionTrigger>
								<AccordionContent className=' leading-relaxed opacity-1 text-slate-700 text-base font-semibold'>
									Yes. It's animated by default, but you can disable it if you
									prefer.
								</AccordionContent>
							</AccordionItem>
						</Accordion>
						<div>
							<img
								src={Image}
								alt=''
								width={500}
								className=' rounded-xl w-full sm:w-[26rem] sm:-m-2 sm:p-2 border object-contain object-center'
							/>
						</div>
					</div>
				</div>
			</section>
			<section id='pricing' className=' bg-secondary -mb-1'>
				<div className='py-24 px-8 max-w-5xl mx-auto '>
					<div className=' flex flex-col text-center w-full mb-20'>
						<h2 className=' border-b-0 font-bold text-3xl lg:text-5xl tracking-tight mb-8 mx-auto'>
							Just one price
						</h2>
						<div className=' text-slate-700 max-w-md mx-auto font-medium'>
							Optimize your operations, improve efficiency, and streamline your
							operations with Gaucho Inventory.
						</div>
					</div>
					<div
						id='pricing-container'
						className=' flex justify-center flex-col lg:flex-row items-center lg:items-stretch gap-8'
					>
						<div id='card' className=' w-full max-w-lg px-8'>
							<div className=' flex flex-col h-full gap-5 lg:gap-8 bg-primary-foreground p-8 rounded-lg'>
								<div className='inline-flex'>
									<p className=' text-5xl tracking-tight font-extrabold'>$5</p>
									<div className=' flex flex-col justify-end mb-1 ml-2'>
										<p className=' text-xs text-slate-700 uppercase font-semibold'>
											per truck per month
										</p>
									</div>
								</div>
								<ul className=' space-y-2.5 leading-relaxed text-base flex-1'>
									<li className=' flex items-center gap-2'>
										<Check /> <span>Gaucho Inventory</span>
									</li>
									<li className='  flex items-center gap-2'>
										<Check /> <span>Unlimited ???</span>
									</li>
									<li className='  flex items-center gap-2'>
										<Check /> <span>More unlimited ???</span>
									</li>
								</ul>
								<Button className=' py-6 bg-primary'>
									<Link to={ROUTES.SIGN_UP} className=' px-20 py-3'>
										Get Gaucho →
									</Link>
								</Button>
							</div>
						</div>
					</div>
				</div>
			</section>
			<section id='faq' className=' bg-secondary'>
				<div className='py-32 pb-64 px-8 max-w-7xl mx-auto'>
					<div className=' flex flex-col md:flex-row gap-12 px-8'>
						<div className=' flex flex-col text-left basis-1/2'>
							<p className=' inline-block font-semibold text-primary mb-4'>
								FAQ
							</p>
							<p className=' text-3xl md:text-4xl font-extrabold !mt-0'>
								Frequently Asked Questions
							</p>
						</div>
						<Accordion type='single' collapsible className=' basis-1/2'>
							<AccordionItem value='item-1' className='text-base font-semibold'>
								<AccordionTrigger className=' data-[state=open]:text-primary hover:no-underline text-base font-semibold md:text-lg'>
									Is it accessible?
								</AccordionTrigger>
								<AccordionContent className=' leading-relaxed opacity-1 text-slate-700 text-base font-semibold'>
									Yes. It adheres to the WAI-ARIA design pattern.
								</AccordionContent>
							</AccordionItem>
							<AccordionItem value='item-2' className='text-base font-semibold'>
								<AccordionTrigger className=' data-[state=open]:text-primary hover:no-underline text-base font-semibold md:text-lg'>
									Is it styled?
								</AccordionTrigger>
								<AccordionContent className=' leading-relaxed opacity-1 text-slate-700 text-base font-semibold'>
									Yes. It comes with default styles that matches the other
									components&apos; aesthetic.
								</AccordionContent>
							</AccordionItem>
							<AccordionItem value='item-3' className='text-base font-semibold'>
								<AccordionTrigger className=' data-[state=open]:text-primary hover:no-underline text-base font-semibold md:text-lg'>
									Is it animated?
								</AccordionTrigger>
								<AccordionContent className=' leading-relaxed opacity-1 text-slate-700 text-base font-semibold'>
									Yes. It's animated by default, but you can disable it if you
									prefer.
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					</div>
				</div>
			</section>
			<section id='cta' className='flex justify-center'>
				<div className='text-center py-24 md:py-48 px-8 max-w-3xl mx-auto '>
					<div className=' flex flex-col text-center justify-center w-full items-center'>
						<h2 className='border-b-0 font-black text-4xl md:text-6xl tracking-tight mb-8 md:mb-16 !pb-0'>
							Ditch the Spreadsheets and Focus on Growth
						</h2>
						<p className=' text-lg max-w-md text-slate-700 mb-12 md:mb-16 !mt-0'>
							Simplify Fleet Reporting for You & Your Crew
						</p>
						<Button className=' bg-primary py-6'>
							<Link to={ROUTES.SIGN_UP} className=' px-14 py-4'>
								Get Gaucho →
							</Link>
						</Button>
					</div>
				</div>
			</section>
			<footer className=' bg-secondary border-t '>
				<nav className=' flex flex-col md:flex-row gap-10 md:gap-36 text-center justify-center items-center py-10'>
					<div>Gaucho</div>
					<div>
						<h3 className=' text-lg'>Links</h3>
					</div>
					<div>
						<h3 className=' text-lg'>Legal</h3>
					</div>
					<div>
						<h3 className=' text-lg'>More</h3>
					</div>
				</nav>
			</footer>
		</div>
	)
}

export default Landing
