import { useState } from "react";
import { StyleSheet, TextInput, Modal } from "react-native";
import { Text, View } from "@/components/Themed";
import { TouchableOpacity } from "react-native";

const initialUser = {
    username: "HyunChul Joe",
    password: "MyPasswordIsReallyStrong",
    email: "joh@kmu.ac.kr",
};

type UserField = "username" | "password" | "email";

export default function SettingsScreen() {
    const [user, setUser] = useState(initialUser);
    const [showPassword, setShowPassword] = useState(false);
    const [editingField, setEditingField] = useState<UserField | null>(null);
    const [newData, setNewData] = useState("");
    const [modalVisible, setModalVisible] = useState(false);

    const handleDeleteAccount = () => {
        console.log("Delete account");
        setModalVisible(true);
    };

    const confirmDeleteAccount = () => {
        console.log("Account deleted");
        setModalVisible(false);
    };

    const handleChangeData = (field: UserField) => {
        setUser({ ...user, [field]: newData });
        setEditingField(null);
        setNewData("");
    };

    return (
        <View style={styles.container}>
            <View style={styles.infoContainer}>
                <View style={styles.row}>
                    <Text style={styles.option}>Username: {user.username}</Text>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => setEditingField("username")}
                    >
                        <Text style={styles.buttonText}>Change</Text>
                    </TouchableOpacity>
                </View>
                {editingField === "username" && (
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={newData}
                            onChangeText={setNewData}
                            placeholder="Enter new username"
                        />
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => handleChangeData("username")}
                        >
                            <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                )}
                <View style={styles.row}>
                    <Text style={styles.option}>Email: {user.email}</Text>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => setEditingField("email")}
                    >
                        <Text style={styles.buttonText}>Change</Text>
                    </TouchableOpacity>
                </View>
                {editingField === "email" && (
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={newData}
                            onChangeText={setNewData}
                            placeholder="Enter new email"
                        />
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => handleChangeData("email")}
                        >
                            <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                )}
                <View style={styles.row}>
                    <Text style={styles.option}>
                        Password: {showPassword ? user.password : "********"}
                    </Text>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => setShowPassword(!showPassword)}
                    >
                        <Text style={styles.buttonText}>
                            {showPassword ? "Hide" : "Show"}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => setEditingField("password")}
                    >
                        <Text style={styles.buttonText}>Change</Text>
                    </TouchableOpacity>
                </View>
                {editingField === "password" && (
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={newData}
                            onChangeText={setNewData}
                            placeholder="Enter new password"
                        />
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => handleChangeData("password")}
                        >
                            <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
            <TouchableOpacity
                className="bg-pink-700"
                style={styles.deconnexionButton}
                onPress={handleDeleteAccount}
            >
                <Text style={styles.deleteButtonText}>Deconnexion Account</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDeleteAccount}
            >
                <Text style={styles.deleteButtonText}>Delete Account</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>
                            Are you sure you want to delete your account?
                        </Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.buttonDelete]}
                                onPress={confirmDeleteAccount}
                            >
                                <Text style={styles.buttonText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    infoContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 5,
    },
    option: {
        fontSize: 16,
        marginRight: 10,
    },
    button: {
        backgroundColor: "blue",
        padding: 5,
        borderRadius: 5,
        marginLeft: 10,
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
    },
    input: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        paddingHorizontal: 10,
        width: "70%",
        marginRight: 10,
    },
    deconnexionButton: {
        marginTop: 20,
        padding: 10,
        borderRadius: 5,
    },
    deleteButton: {
        marginTop: 20,
        backgroundColor: "red",
        padding: 10,
        borderRadius: 5,
    },
    deleteButtonText: {
        color: "white",
        fontWeight: "bold",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.9)",
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    buttonClose: {
        backgroundColor: "gray",
    },
    buttonDelete: {
        backgroundColor: "red",
    },
});
