import { router, useNavigation } from "expo-router";
import Home from "./Home";
import { RootTabParamList } from "@/src/navigation/MainTabs";
import { NavigationProp } from "@react-navigation/native";


export function HomeScreen() {
 const nav = useNavigation<NavigationProp<RootTabParamList>>();


    function OnOpenRequestLeave(): void {
        nav.navigate("HistoryTab");
    }

    function OnOpenHistory(): void {
        nav.navigate("HistoryTab");
    }

    function OnViewTeam(): void {
        nav.navigate("TeamTab");
    }

    // function OnViewLeaveSummary(): void {
    //     nav.navigate("LeaveSummaryTab");
    // }

    // function OnViewHRNews(): void {
    //     nav.navigate("HRNewsTab");
    // }

    return (
        <Home
            onRequestLeave={() => OnOpenRequestLeave()}
            onOpenHistory={() => OnOpenHistory()}
            onViewTeam={() => OnViewTeam()}
            // onViewLeaveSummary={() => OnViewLeaveSummary()}
            // onViewHRNews={() => OnViewHRNews()}
        />

    );
}