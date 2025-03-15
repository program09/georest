import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        backgroundColor: '#fff',
    },
    containerTab: {
        flex: 1,
        padding: 20,
        paddingTop: 0,
        backgroundColor: "#fff",
    },
    containerTop: {
        width: '100%',
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    label: {
        fontSize: 16,
        marginTop: 10,
        fontWeight: "bold",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        padding: 10,
        paddingVertical: 15,
        marginBottom: 15,
    },
    inputdisabled: {
        backgroundColor: '#ddd',
        borderColor: '#ddd',
    },
    textArea: {
        height: 80,
    },
    button: {
        backgroundColor: "#2196F3",
        padding: 10,
        alignItems: "center",
        borderRadius: 5,
        marginBottom: 10,
    },
    cancelButton: {
        backgroundColor: "#f44336",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    footerButtons: {
        width: '100%',
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 10,
    },
    tabBar: {
        borderTopWidth: 1,
        borderTopColor: "#ccc",
        height: 60,
        display: "flex",
        alignItems: "center",
        padding: 0,
    },
    tabLabel: {
        fontSize: 16,
        fontWeight: "bold",
        padding: 0,
        margin: 0,
        top: -10,
    },
    tabIndicator: {
        backgroundColor: '#000'
    },
    itemphotocontent: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 15,
        padding: 5,
        backgroundColor: '#f8f8f8',
        borderRadius: 20,
    },
    itemphoto: {
        flex: 1,
    },
    image: {
        width: 150,
        height: 150,
        backgroundColor: "#ddd",
        borderRadius: 15,
    },
    contentItem: {
        flex: 1,
        maxWidth: '50%',
        backgroundColor: '#000',
        padding: 15,
        borderRadius: 15,
    },
    textlight: {
        fontSize: 18,
        width: '100%',
        textAlign: 'center',
        color: '#fff',
    },
    mapContent: {
        flex: 1,
        width: '100% -10',
        backgroundColor: '#000',
        margin: 10,
        borderRadius: 25,
        overflow: 'hidden',
    }
});