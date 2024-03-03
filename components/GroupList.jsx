// --- Group List Component ---

// Import modules
import { useRouter } from "next/router"

import Link from "next/link"

// Import styling
import styles from "./GroupList.module.scss"
import { LuHome, LuPlusCircle, LuSettings } from "react-icons/lu";

// Group List
export default function GroupList({ groups }) {

    // Allow viewing the current page parameters
    const router = useRouter()

    // Group list
    return (
        <div className={styles.list}>

            <div className={styles.groups}>

                <Link
                    className={Object.keys(router.query).length === 0 && router.pathname === "/dashboard" ? styles.item + " " + styles.active : styles.item }
                    href="/dashboard">

                    <p>
                        <LuHome size={24} />
                    </p>

                </Link>

                {
                    groups.map((group) => {

                        return (
                            
                            <Link
                                className={ (router.query.group == group.id & Object.keys(router.query).length == 1 ) ? styles.item + " " + styles.active : styles.item} key={group.id} 
                                href={"/dashboard?group=" + group.id}>

                                <p>{group.name[0].toUpperCase()}</p>
                                
                            </Link>
                        )
                    })
                }

                <Link
                    className={router.pathname === "/dashboard/new" ? styles.item + " " + styles.active : styles.item }
                    href="/dashboard/new?item=group">

                    <p>
                        <LuPlusCircle size={24} />
                    </p>

                </Link>

                <Link
                    className={router.pathname === "/dashboard/settings" ? styles.item + " " + styles.active : styles.item }
                    href="/dashboard/settings">

                    <p>
                        <LuSettings size={24} />
                    </p>

                </Link>
            </div>
        </div>
    )
}