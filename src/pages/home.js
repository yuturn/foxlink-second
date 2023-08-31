const Home = (props) => {
    const { sidebar } = props
    return (
        <div>
            {sidebar}
            <p> (Protected) Home Page</p>
        </div>
    )
}
export default Home;