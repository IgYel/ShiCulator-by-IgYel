export const App = ({ Components }) => {
    const { HeaderComponent, MainComponent, FooterComponent } = Components;
    const num = 2;
    return (
        <>
            <HeaderComponent num={num} />
            <MainComponent />
            <FooterComponent />
        </>
    );
};
