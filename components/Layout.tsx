import Navbar from "./Navbar";

const Layout = ({ children }: React.PropsWithChildren) => {
    return (
        <>
            <Navbar />
            <div>{children}</div>
        </>
    )
}

export default Layout;