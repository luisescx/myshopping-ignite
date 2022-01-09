import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { styles } from "./styles";
import { Product, ProductProps } from "../Product";

export function ShoppingList() {
    const [products, setProducts] = useState<ProductProps[]>([]);

    // useEffect(() => {
    //     firestore()
    //         .collection("products")
    //         .doc("string-id")
    //         .get()
    //         .then((response) =>
    //             console.log({
    //                 id: response.id,
    //                 ...response.data(),
    //             })
    //         );
    // }, []);

    useEffect(() => {
        const subscribe = firestore()
            .collection("products")
            .orderBy("createdAt", "desc")
            .onSnapshot(
                (querySnapshot) => {
                    const data = querySnapshot.docs.map((doc) => {
                        return {
                            id: doc.id,
                            ...doc.data(),
                        };
                    }) as ProductProps[];

                    setProducts(data);
                },
                (error) => {
                    console.log(error);
                }
            );

        return () => subscribe();
    }, []);

    return (
        <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <Product data={item} />}
            showsVerticalScrollIndicator={false}
            style={styles.list}
            contentContainerStyle={styles.content}
        />
    );
}
