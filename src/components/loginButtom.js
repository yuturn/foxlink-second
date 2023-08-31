import {useNavigate,useLocation} from 'react-router-dom'
import { useState } from 'react'
import { createContext } from 'react'
export const UserContext = createContext()
export const LogInButtons = () => {
    const { user, setUser } = useState(UserContext)
    const navigate = useNavigate()
    const location = useLocation()
    console.log(user.loggedIn)
return (
        <div>
            <p>{`Logged In: ${user.loggedIn}`}</p>
            {!user.loggedIn ? (
                <>
                    <button
                        onClick={() => {
                            if (user.loggedIn) return
                            setUser({ loggedIn: true, level: 1 })
                            localStorage.setItem('userIsLogin', 'true')
                            if (location.state?.from) {
                                navigate(location.state.from)
                            }
                        }}
                    >
                        Log In
                    </button>
<button
                        onClick={() => {
                            if (user.loggedIn) return
                            setUser({ loggedIn: true, level: 2 })
if (location.state?.from) {
                                navigate(location.state.from)
                            }
                        }}
                    >
                        Log In As Level 2
                    </button>
                </>
            ) : (
                <button
                    onClick={() => {
                        if (!user.loggedIn) return
                        setUser({ loggedIn: false })
                        localStorage.setItem('userIsLogin', 'false')
                    }}
                >
                    Log Out
                </button>
            )}
<div style={{ marginBottom: '12px' }}></div>
        </div>
    )
}