import React, { useState, useCallback } from "react";
import firestore from "@react-native-firebase/firestore";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Container } from "./styles";
import { ButtonIcon } from "../ButtonIcon";
import { Input } from "../Input";
import { Alert, Keyboard } from "react-native";

export function FormBox() {
    const [description, setDescription] = useState("");
    const [quantity, setQuantity] = useState(0);

    const navigation = useNavigation();

    async function handleProductAdd() {
        // to add a custom id, as uuid or a number
        // .doc("my-custom-id")
        // .set

        firestore()
            .collection("products")
            .add({
                description,
                quantity,
                done: false,
                createdAt: firestore.FieldValue.serverTimestamp(),
            })
            .then(() => {
                Alert.alert("Produto adicionado com sucesso");

                setDescription("");
                setQuantity(0);
            })
            .catch((error) => {
                console.log(error);
                Alert.alert(
                    "Erro ao adicionar produto, tente novamente mais tarde"
                );

                setDescription("");
                setQuantity(0);
            });

        Keyboard.dismiss();
    }

    useFocusEffect(
        useCallback(() => {
            const unsubscribe = navigation.addListener("blur", () => {
                setDescription("");
                setQuantity(0);
            });

            return unsubscribe;
        }, [])
    );

    return (
        <Container>
            <Input
                placeholder="Nome do produto"
                size="medium"
                onChangeText={setDescription}
                value={description}
                autoCapitalize="sentences"
            />

            <Input
                placeholder="0"
                keyboardType="numeric"
                size="small"
                style={{ marginHorizontal: 8 }}
                onChangeText={(value) => setQuantity(Number(value))}
                value={String(quantity)}
            />

            <ButtonIcon
                size="large"
                icon="add-shopping-cart"
                onPress={handleProductAdd}
            />
        </Container>
    );
}
