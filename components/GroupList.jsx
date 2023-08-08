// --- Group List Component ---

// Import Modules
import { useRouter } from "next/router"

import Link from "next/link"

// Import styling
import styles from "./GroupList.module.scss"

// Group List
export default function GroupList({ groups }) {

    // Allow viewing the current page parameters
    const router = useRouter()

    // Group list
    return (
        <div className={styles.list}>

            <div className={styles.groups}>

                <Link
                    className={Object.keys(router.query).length === 0 ? styles.item + " " + styles.active : styles.item }
                    href="/dashboard">

                    <p>H</p>

                </Link>

                {
                    groups.map((group) => {
                        return (
                            
                            <Link
                                className={ router.query.group == group.id ? styles.item + " " + styles.active : styles.item} key={group.id}
                                href={"/dashboard?group=" + group.id}>

                                <p>{group.name[0]}</p>
                                
                            </Link>
                        )
                    })
                }
            </div>
        </div>
    )
}