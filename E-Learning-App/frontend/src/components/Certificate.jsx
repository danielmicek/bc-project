import React from "react";
import {Document, Font, Page, StyleSheet, Text, View} from "@react-pdf/renderer";
import RobotoRegular from "../fonts/Roboto-Regular.ttf";

Font.register({
    family: "Roboto",
    src: RobotoRegular,
});

const ORANGE = "#FC9328";

const styles = StyleSheet.create({
    page: {
        paddingTop: 48,
        paddingBottom: 48,
        paddingHorizontal: 54,
        backgroundColor: "#FFFFFF",
        fontFamily: "Roboto",
        flexDirection: "column",
    },

    headerBar: {
        height: 10,
        backgroundColor: ORANGE,
        borderRadius: 6,
        marginBottom: 22,
    },

    brandRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "baseline",
        marginBottom: 10,
    },
    brand: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#111827",
        letterSpacing: 0.2,
    },
    brandAccent: {
        color: ORANGE,
    },
    docId: {
        fontSize: 10,
        color: "#6B7280",
    },

    title: {
        fontSize: 34,
        fontWeight: "bold",
        color: "#111827",
        marginTop: 6,
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 12,
        color: "#6B7280",
        marginBottom: 18,
        lineHeight: 1.4,
    },

    divider: {
        height: 1,
        backgroundColor: "#E5E7EB",
        marginVertical: 18,
    },

    label: {
        fontSize: 10,
        letterSpacing: 1.2,
        color: "#6B7280",
        textTransform: "uppercase",
        marginBottom: 6,
    },

    name: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#111827",
        marginBottom: 10,
    },

    highlightBox: {
        borderWidth: 1.5,
        borderColor: ORANGE,
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 14,
        backgroundColor: "#FFF7ED",
        marginTop: 8,
        marginBottom: 18,
    },
    highlightLine: {
        fontSize: 12,
        color: "#111827",
        marginBottom: 4,
        lineHeight: 1.35,
    },
    highlightStrong: {
        color: ORANGE,
        fontWeight: "bold",
    },

    bodyText: {
        fontSize: 12,
        color: "#111827",
        lineHeight: 1.5,
        marginBottom: 12,
    },

    metaRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: "auto",
        marginBottom: 40,
    },
    metaCol: {
        width: "48%",
    },
    metaValue: {
        fontSize: 12,
        color: "#111827",
        fontWeight: "bold",
    },

    footer: {
        position: "absolute",
        bottom: 34,
        left: 54,
        right: 54,
    },
    footerBar: {
        height: 8,
        backgroundColor: ORANGE,
        borderRadius: 6,
        marginBottom: 10,
    },
    footerText: {
        fontSize: 9,
        color: "#6B7280",
        lineHeight: 1.35,
    },
});

export default function Certificate({ userName, percentage, certificateId }) {
    const date = new Date().toLocaleDateString("sk-SK");

    return (
        <Document title="Eleonore Certificate" author="eleonore">
            <Page size="A4" style={styles.page}>
                <View style={{ flex: 1 }}>
                    <View style={styles.headerBar} />

                    <View style={styles.brandRow}>
                        <Text style={styles.brandAccent}>
                            eleonore
                        </Text>
                        <Text style={styles.docId}>Certificate ID: {certificateId}</Text>
                    </View>

                    <Text style={styles.title}>Certifikát o absolvovaní</Text>
                    <Text style={styles.subtitle}>
                        Tento certifikát potvrdzuje úspešné splnenie podmienok e-learning kurzu v rámci platformy{" "}
                        <Text style={styles.brandAccent}>eleonore</Text>.
                    </Text>

                    <View style={styles.divider} />

                    <Text style={styles.label}>Udelené používateľovi</Text>
                    <Text style={styles.name}>{userName}</Text>

                    <View style={styles.highlightBox}>
                        <Text style={styles.highlightLine}>
                            Kurz: <Text style={styles.highlightStrong}>Softvérové inžinierstvo</Text>
                        </Text>
                        <Text style={styles.highlightLine}>
                            Podmienka: získanie <Text style={styles.highlightStrong}>zlatej medaily</Text> v{" "}
                            <Text style={styles.highlightStrong}>Gold teste</Text>
                        </Text>
                        <Text style={styles.highlightLine}>
                            Dosiahnuté % : <Text style={styles.highlightStrong}>{percentage}</Text>
                        </Text>
                    </View>

                    <Text style={styles.bodyText}>
                        Týmto potvrdzujeme, že vyššie uvedený účastník splnil požiadavky kurzu vrátane úspešného absolvovania Gold testu
                        a tým získal nárok na vydanie certifikátu.
                    </Text>

                    <View style={styles.metaRow}>
                        <View style={styles.metaCol}>
                            <Text style={styles.label}>Dátum vystavenia</Text>
                            <Text style={styles.metaValue}>{date}</Text>
                        </View>
                        <View style={styles.metaCol}>
                            <Text style={styles.label}>Platforma</Text>
                            <Text style={styles.metaValue}>eleonore</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.footer}>
                    <View style={styles.footerBar} />
                    <Text style={styles.footerText}>
                        Certifikát je generovaný elektronicky v rámci platformy eleonore. Overenie je možné pomocou Certificate ID uvedeného vyššie.
                    </Text>
                </View>
            </Page>
        </Document>
    );
}
