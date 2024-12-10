import {
    StyleSheet,
    TextInput,
    Modal,
    useColorScheme,
    Appearance,
} from "react-native";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Text, View } from "@/components/Themed";
import { useAuth } from "@/context/AuthProvider";

const initialUser = {
    username: "HyunChul Joe",
    password: "MyPasswordIsReallyStrong",
    email: "joh@kmu.ac.kr",
};

type UserField = "username" | "password" | "email";

export default function SettingsScreen() {
    const colorScheme = useColorScheme();

    const { clearUser } = useAuth();
    const [newData, setNewData] = useState("");
    const [user, setUser] = useState(initialUser);
    const [showPassword, setShowPassword] = useState(false);
    const [editingField, setEditingField] = useState<UserField | null>(null);
    const [modalVisibleDelete, setModalVisibleDelete] = useState(false);
    const [modalVisibleDisconnection, setModalVisibleDisconnection] =
        useState(false);

    const handleDisconnectionAccount = () => {
        console.log("Disconnection account");
        setModalVisibleDisconnection(true);
    };

    const confirmDisconnectionAccount = () => {
        console.log("Account disconnection");
        clearUser();
        setModalVisibleDisconnection(false);
    };

    const handleDeleteAccount = () => {
        console.log("Delete account");
        setModalVisibleDelete(true);
    };

    const confirmDeleteAccount = () => {
        console.log("Account deleted");
        setModalVisibleDelete(false);
    };

    const handleChangeData = (field: UserField) => {
        setUser({ ...user, [field]: newData });
        setEditingField(null);
        setNewData("");
    };

    return (
        <View className="flex-1 items-center justify-center">
            <View className="mb-5 items-center">
                <TouchableOpacity
                    className="ml-3 rounded-lg bg-blue-500 p-2"
                    onPress={() =>
                        colorScheme === "dark"
                            ? Appearance.setColorScheme("light")
                            : Appearance.setColorScheme("dark")
                    }
                >
                    <Text lightColor="white" className="font-bold">
                        {colorScheme === "dark" ? "Light Mode" : "Dark Mode"}
                    </Text>
                </TouchableOpacity>
            </View>
            <View className="my-2 flex-row items-center">
                <Text className="mr-3 text-base">Language: English</Text>
                <TouchableOpacity
                    className="ml-3 rounded-lg bg-blue-500 p-2"
                    onPress={() => alert("Change language")}
                >
                    <Text lightColor="white" className="font-bold">
                        Change Language
                    </Text>
                </TouchableOpacity>
            </View>
            <View className="my-2 flex-row items-center">
                <Text className="mr-3 text-base">
                    Username: {user.username}
                </Text>
                <TouchableOpacity
                    className="ml-3 rounded-lg bg-blue-500 p-2"
                    onPress={() => setEditingField("username")}
                >
                    <Text lightColor="white" className="font-bold">
                        Change
                    </Text>
                </TouchableOpacity>
            </View>
            {editingField === "username" && (
                <View className="mt-3 flex-row items-center">
                    <TextInput
                        className="mr-3 h-10 w-3/5 border-x-2 border-gray-500 px-3"
                        value={newData}
                        onChangeText={setNewData}
                        placeholder="Enter new username"
                    />
                    <TouchableOpacity
                        className="ml-3 rounded-lg bg-blue-500 p-2"
                        onPress={() => handleChangeData("username")}
                    >
                        <Text lightColor="white" className="font-bold">
                            Save
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
            <View className="my-2 flex-row items-center">
                <Text className="mr-3 text-base">Email: {user.email}</Text>
                <TouchableOpacity
                    className="ml-3 rounded-lg bg-blue-500 p-2"
                    onPress={() => setEditingField("email")}
                >
                    <Text lightColor="white" className="font-bold">
                        Change
                    </Text>
                </TouchableOpacity>
            </View>
            {editingField === "email" && (
                <View className="mt-3 flex-row items-center">
                    <TextInput
                        className="mr-3 h-10 w-3/5 border-x-2 border-gray-500 px-3"
                        value={newData}
                        onChangeText={setNewData}
                        placeholder="Enter new email"
                    />
                    <TouchableOpacity
                        className="ml-3 rounded-lg bg-blue-500 p-2"
                        onPress={() => handleChangeData("email")}
                    >
                        <Text lightColor="white" className="font-bold">
                            Save
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
            <View className="my-2 flex-row items-center">
                <Text className="mr-3 text-base">
                    Password: {showPassword ? user.password : "********"}
                </Text>
                <TouchableOpacity
                    className="ml-3 rounded-lg bg-blue-500 p-2"
                    onPress={() => setShowPassword(!showPassword)}
                >
                    <Text lightColor="white" className="font-bold">
                        {showPassword ? "Hide" : "Show"}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className="ml-3 rounded-lg bg-blue-500 p-2"
                    onPress={() => setEditingField("password")}
                >
                    <Text lightColor="white" className="font-bold">
                        Change
                    </Text>
                </TouchableOpacity>
            </View>
            {editingField === "password" && (
                <View className="mt-3 flex-row items-center">
                    <TextInput
                        className="mr-3 h-10 w-3/5 border-x-2 border-gray-500 px-3"
                        value={newData}
                        onChangeText={setNewData}
                        placeholder="Enter new password"
                    />
                    <TouchableOpacity
                        className="ml-3 rounded-lg bg-blue-500 p-2"
                        onPress={() => handleChangeData("password")}
                    >
                        <Text lightColor="white" className="font-bold">
                            Save
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
            <TouchableOpacity
                className="mt-5 rounded-lg bg-pink-700 p-3"
                onPress={handleDisconnectionAccount}
            >
                <Text lightColor="white" className="font-bold">
                    Disconnection Account
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                className="mt-5 rounded-md bg-red-500 p-3"
                onPress={handleDeleteAccount}
            >
                <Text lightColor="white" className="font-bold">
                    Delete Account
                </Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisibleDisconnection}
                onRequestClose={() => setModalVisibleDisconnection(false)}
            >
                <View className="flex-1 items-center justify-center bg-red-700">
                    <View className="m-5 items-center rounded-3xl bg-blue-600 p-9">
                        <Text className="mb-4 text-center">
                            Are you sure you want to disconnection your account?
                        </Text>
                        <View className="w-full flex-row justify-between">
                            <TouchableOpacity
                                className="ml-3 rounded-lg bg-gray-500 p-2"
                                onPress={() =>
                                    setModalVisibleDisconnection(false)
                                }
                            >
                                <Text lightColor="white" className="font-bold">
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="ml-3 rounded-lg bg-red-500 p-2"
                                onPress={confirmDisconnectionAccount}
                            >
                                <Text lightColor="white" className="font-bold">
                                    Disconnection
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisibleDelete}
                onRequestClose={() => setModalVisibleDelete(false)}
            >
                <View className="flex-1 items-center justify-center bg-red-700">
                    <View className="m-5 items-center rounded-3xl bg-blue-600 p-9">
                        <Text className="mb-4 text-center">
                            Are you sure you want to delete your account?
                        </Text>
                        <View className="w-full flex-row justify-between">
                            <TouchableOpacity
                                className="ml-3 rounded-lg bg-gray-500 p-2"
                                onPress={() => setModalVisibleDelete(false)}
                            >
                                <Text lightColor="white" className="font-bold">
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="ml-3 rounded-lg bg-red-500 p-2"
                                onPress={confirmDeleteAccount}
                            >
                                <Text lightColor="white" className="font-bold">
                                    Delete
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
