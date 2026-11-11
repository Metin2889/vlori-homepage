import { HomePage } from "../components/HomePage"

export const revalidate = 300

export const metadata = { alternates: { canonical: "/" } }

export default function Page() {
    return <HomePage mode="berater" />
}
