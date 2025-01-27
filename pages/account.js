import { useSession } from "next-auth/react";
import Navigation from "../components/navigation";
import { signOut } from "next-auth/react"

export default function Account() {
	// TODO: fix indentation, it's inconsistent with the other files.
	const { data: session } = useSession();

	if (session) {
		return (
			// INFO: instead of using top-level div tags, I changed it to fragment (<>) tags.
			<>
				<Navigation tab="account" />
				<div className="p-4">
					<p>Signed in as <span className="font-bold text-purple-500">{session.user.email}</span></p>
					<button onClick={() => signOut({ callbackUrl: "/" })} className="font-bold text-xl text-white p-2 bg-purple-500 hover:bg-purple-700 mt-2"> Sign out </button>
				</div>
			</>
		)
	}
}