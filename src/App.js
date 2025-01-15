export const App = ({ Components, RouteComponent }) => {
    const { HeaderComponent, MainComponent, FooterComponent } = Components;
    return (
        <>
            <HeaderComponent />
            <MainComponent RouteComponent={RouteComponent}/>
            <FooterComponent />
        </>
    );
};
