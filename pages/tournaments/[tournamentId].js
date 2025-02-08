import { useRouter } from 'next/router';
import Navigation from '../../components/navigation';
import Pairing from '../../components/Pairing';
import Roster from '../../components/Roster';
import SectionSelector from '../../components/SectionSelector';
import Standings from '../../components/Standings';
import TabBar from '../../components/TabBar';
import TournamentList from '../../components/TournamentList';

import { useState } from "react";
import Head from 'next/head';

const Tournament = () => {
    // TODO: fix indentation?
    // Also, why is the name of this file surrounded by brackets?
    const router = useRouter();
    const { tournamentId } = router.query

    const [selSection, setSelSection] = useState();
    const [focus, setFocus] = useState("roster")
    const [generatedRounds, setGeneratedRounds] = useState();

    return (
        <>
            <Head>
                <title>SLCA - Tournament System</title>
                <meta name="description" content="Student-Led Chess Association Tournament System" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* This Navigation component creates links to other tabs, such as the tournaments or chapters tag. */}
            <Navigation tab="tournaments" />

            <div className='grid grid-cols-4 mt-4 mx-4'>
                {/* This component shows a list of the tournaments, you can also create new tournaments. */}
                <TournamentList active={tournamentId} />

                {/* Only loaded when tournamentId loads */}
                {tournamentId &&
                    <div className={`col-span-3 px-4`} >
                        {/* A section contains: an id, name, tournamentId, tournament, schools, players, and rounds. */}
                        <SectionSelector activeTourney={tournamentId} activeSection={selSection} setActiveSection={setSelSection} />
                        <hr className='my-2' />

                        {/* Shows the roster, pairing, and standings tabs. */}
                        {selSection && <TabBar focus={focus} setFocus={setFocus} />}
                        <hr className="my-2" />

                        {((focus == "roster") && (selSection)) && <Roster section={selSection.value} />}
                        {((focus == "pairing") && (selSection)) && <Pairing section={selSection.value} generatedRounds={generatedRounds} setGeneratedRounds={setGeneratedRounds} />}
                        {((focus == "standings") && (selSection)) && <Standings section={selSection.value} />}
                    </div>
                }
            </div>
        </>
    )
}

export default Tournament;