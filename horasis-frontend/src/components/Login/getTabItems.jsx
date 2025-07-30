
const tabTextStyle = {
    margin: 0,
    display: "flex",
    gap: "10px",
    alignItems: "center",
    padding: "0px 20px",
};

export const getTabItems = (setActiveKey) => {
    return ([
        {
            key: '2',
            label: (
                <p style={tabTextStyle} onClick={() => {
                    setActiveKey('2')
                }} >
                    <span className="material-symbols-outlined">
                        badge
                    </span>Executive Login
                </p>
            ),
            children: <></>,
        },
        {
            key: '1',
            label: (
                <p style={tabTextStyle} onClick={() => {
                    setActiveKey('1')
                }} >
                    <span className="material-symbols-outlined">
                        shield_person
                    </span>Admin Login
                </p>
            ),
            children: <></>,
        },

    ])
}
