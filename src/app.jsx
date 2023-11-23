import React from "react";
import './app.css'

export default function App() {
    return (
        <div>
            <header className="ALL-l-header">
                <section id="logo">
                    <img src="/orange cowboy hat.png" alt="Orange Cowboy Hat Logo" width="100px" />
                        <h1>Activity Anarchy</h1>
                </section>
                <nav>
                    <menu className="ALL-menu" id="navigation_menu">
                        <a href="index.html">Login</a>
                        <a href="enter_session.html" id="nav_enter_session">Enter Session</a>
                        <a href="about.html">About</a>
                    </menu>
                </nav>
            </header>
            <main>Main stuff here</main>
            <footer className="ALL-l-footer">
                <p><span className="Author-Name">Michael Saulls</span> | <a
                    href="https://github.com/mitoed/Startup.git">GitHub
                    Repository</a></p>
            </footer>
        </div>
    )
}