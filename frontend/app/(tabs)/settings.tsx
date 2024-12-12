import {
    StyleSheet,
    TextInput,
    Modal,
    useColorScheme,
    Appearance,
    View,
} from "react-native";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Text } from "@/components/Themed";
import { useAuth } from "@/context/AuthProvider";
import { Ionicons } from "@expo/vector-icons";

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
        <View className="flex-1">
            <View className="flex h-20 flex-row items-center border-b-2 border-slate-500 p-4">
                <div className="flex flex-grow flex-row items-center gap-5">
                    <Ionicons name="color-palette" size={24} color="black" />
                    <Text className="mr-3 text-base">
                        Color Scheme: {colorScheme}
                    </Text>
                </div>
                <div className="flex-shrink">
                    <TouchableOpacity
                        className="ml-3 rounded-lg bg-blue-500 p-2"
                        onPress={() =>
                            colorScheme === "dark"
                                ? Appearance.setColorScheme("light")
                                : Appearance.setColorScheme("dark")
                        }
                    >
                        <Text lightColor="white" className="font-bold">
                            {colorScheme === "dark"
                                ? "Light Mode"
                                : "Dark Mode"}
                        </Text>
                    </TouchableOpacity>
                </div>
            </View>
            <View className="flex h-20 flex-row border-y-2 border-slate-500 p-4">
                <div className="flex flex-grow flex-row items-center gap-5">
                    <Ionicons name="language" size={24} color="black" />
                    <Text className="mr-3 text-base">Language: English</Text>
                </div>
                <div className="flex-shrink">
                    <TouchableOpacity
                        className="ml-3 rounded-lg bg-blue-500 p-2"
                        onPress={() => alert("Change language")}
                    >
                        <Text lightColor="white" className="font-bold">
                            Change Language
                        </Text>
                    </TouchableOpacity>
                </div>
            </View>
            <View className="flex h-20 flex-row border-y-2 border-slate-500 p-4">
                <div className="flex flex-grow flex-row items-center gap-5">
                    <Ionicons name="person" size={24} color="black" />
                    <Text className="mr-3 text-base">
                        Username: {user.username}
                    </Text>
                </div>
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
                <View className="flex h-20 flex-row border-y-2 border-slate-500 p-4">
                    <div className="flex flex-grow flex-row items-center gap-5">
                        <TextInput
                            className="h-10 w-3/5 border-2 border-gray-500 px-3"
                            value={newData}
                            onChangeText={setNewData}
                            placeholder="Enter new username"
                        />
                    </div>
                    <div className="flex-shrink">
                        <TouchableOpacity
                            className="ml-3 rounded-lg bg-blue-500 p-2"
                            onPress={() => handleChangeData("username")}
                        >
                            <Text lightColor="white" className="font-bold">
                                Save
                            </Text>
                        </TouchableOpacity>
                    </div>
                </View>
            )}
            <View className="flex h-20 flex-row border-y-2 border-slate-500 p-4">
                <div className="flex flex-grow flex-row items-center gap-5">
                    <Ionicons name="mail" size={24} color="black" />
                    <div>
                        <Text className="text-base">Email: {user.email}</Text>
                    </div>
                </div>
                <div className="flex-shrink">
                    <TouchableOpacity
                        className="ml-3 rounded-lg bg-blue-500 p-2"
                        onPress={() => setEditingField("email")}
                    >
                        <Text lightColor="white" className="font-bold">
                            Change
                        </Text>
                    </TouchableOpacity>
                </div>
            </View>
            {editingField === "email" && (
                <View className="flex h-20 flex-row border-y-2 border-slate-500 p-4">
                    <div className="flex flex-grow flex-row items-center gap-5">
                        <TextInput
                            className="mr-3 h-10 w-3/5 border-2 border-gray-500 px-3"
                            value={newData}
                            onChangeText={setNewData}
                            placeholder="Enter new email"
                        />
                    </div>
                    <TouchableOpacity
                        className="mr-auto rounded-lg bg-blue-500 p-2"
                        onPress={() => handleChangeData("email")}
                    >
                        <Text lightColor="white" className="font-bold">
                            Save
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
            <View className="flex h-20 flex-row border-y-2 border-b-4 border-slate-500 p-4">
                <div className="flex flex-grow flex-row items-center gap-5">
                    <Ionicons name="lock-closed" size={24} color="black" />
                    <Text className="mr-3 text-base">
                        Password: {showPassword ? user.password : "********"}
                    </Text>
                </div>
                <div className="flex flex-shrink flex-row">
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
                </div>
            </View>
            {editingField === "password" && (
                <View className="flex h-20 flex-row border-b-4 border-slate-500 p-4">
                    <div className="flex flex-grow flex-row items-center gap-5">
                        <TextInput
                            className="h-10 w-3/5 border-2 border-gray-500 px-3"
                            value={newData}
                            onChangeText={setNewData}
                            placeholder="Enter new password"
                        />
                    </div>
                    <div className="flex-shrink">
                        <TouchableOpacity
                            className="ml-3 rounded-lg bg-blue-500 p-2"
                            onPress={() => handleChangeData("password")}
                        >
                            <Text lightColor="white" className="font-bold">
                                Save
                            </Text>
                        </TouchableOpacity>
                    </div>
                </View>
            )}
            <div className="mb-20 mt-auto flex flex-col gap-3 p-4">
                <TouchableOpacity
                    className="border-4 border-slate-500 bg-pink-700 p-4"
                    onPress={handleDisconnectionAccount}
                >
                    <Text lightColor="white" className="text-center font-bold">
                        Disconnection Account
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className="border-4 border-slate-500 bg-red-500 p-4"
                    onPress={handleDeleteAccount}
                >
                    <Text lightColor="white" className="text-center font-bold">
                        Delete Account
                    </Text>
                </TouchableOpacity>
            </div>

            <Modal
                animationType="fade"
                transparent
                visible={modalVisibleDisconnection}
                onRequestClose={() => setModalVisibleDisconnection(false)}
            >
                <View className="flex-1 items-center justify-center align-middle backdrop-blur">
                    <View className="m-5 items-center rounded-3xl bg-white p-9 shadow-black">
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
                animationType="fade"
                transparent={true}
                visible={modalVisibleDelete}
                onRequestClose={() => setModalVisibleDelete(false)}
            >
                <View className="flex-1 items-center justify-center align-middle backdrop-blur">
                    <View className="m-5 items-center rounded-3xl bg-white p-9 shadow-black">
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
