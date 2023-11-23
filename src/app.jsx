import React from "react";
import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import { Login } from './login/login.jsx'
import './app.css'

export default function App() {

    return (
        <BrowserRouter>
            <div>
                <header className="ALL-l-header">
                    <section id="logo">
                        <img src="/orange cowboy hat.png" alt="Orange Cowboy Hat Logo" width="100px" />
                            <h1>Activity Anarchy</h1>
                    </section>
                    <nav>
                        <menu className="ALL-menu" id="navigation_menu">
                            <NavLink to=''>Login</NavLink>
                            <NavLink to='enter'>Enter Session</NavLink>
                            <NavLink to='about'>About</NavLink>
                        </menu>
                    </nav>
                </header>
                <Routes>
                    <Route path='/' element={<Login />} exact/>
                    <Route path='*' element={<NotFound />}/>
                </Routes>
                <footer className="ALL-l-footer">
                    <p><span className="Author-Name">Michael Saulls</span> | <a
                        href="https://github.com/mitoed/Startup.git">GitHub
                        Repository</a></p>
                </footer>
            </div>
        </BrowserRouter>
    )
}

function NotFound() {
    return <main><h1>404: Return to sender. Address unknown.</h1></main>
}