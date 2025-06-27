export default function Layout(props) {
    const { children } = props;

    return (
        <>
            <header>
                <h1 className="text-gradient">Copacetic</h1>
            </header>
            <main>
                {children}
            </main>
            <footer>
                <small>Created by</small>
                <a target="_blank" href="https://github.com/chplay2020">
                    <img alt="pfp" src="https://avatars.githubusercontent.com/u/127222705?v=4" />
                    <p>@chplay2020</p>
                </a>
                <i class="fa-brands fa-github"></i>
            </footer>
        </>
    );
}