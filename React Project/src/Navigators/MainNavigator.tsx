import { Routes, Route } from "react-router-dom";
import ProjectsList from "../pages/ProjectsList/ProjectList";
import SubmitProject from "../pages/SubmitProject/SubmitProject";
import Layout from "../pages/Layout";
import NotFound from "../pages/NotFound";
import Login from "../pages/Login/Login";
import SignUp from "../pages/SignUp/SignUp";
import { useAuth } from "../contexts/AuthContext";
import ProjectPage from "../pages/ProjectPage/ProjectPage";
import SubmitBid from "../pages/SubmitBid/SubmitBid";

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";

import { createClient } from "graphql-ws";
import { WEBSOCKET_URL } from "../configs/urls";
import { Subscription } from "../components/Subscription";

export default function MainNavigator() {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading</div>;

    const wsLink = new GraphQLWsLink(
        createClient({
            url: WEBSOCKET_URL,
            connectionParams: { authToken: user?.token },
        })
    );

    const client = new ApolloClient({
        link: wsLink,
        cache: new InMemoryCache(),
    });

    return (
        <ApolloProvider client={client}>
            <Subscription>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        {user ? (
                            <>
                                <Route index element={<ProjectsList />} />
                                <Route path="projects/submit" element={<SubmitProject />} />
                                <Route path="projects/:id" element={<ProjectPage />} />
                                <Route path="projects/:id/bid" element={<SubmitBid />} />
                            </>
                        ) : (
                            <>
                                <Route index element={<Login />} />
                                <Route path="login" element={<Login />} />
                                <Route path="sign-up" element={<SignUp />} />
                            </>
                        )}
                        <Route path="*" element={<NotFound />} />
                    </Route>
                </Routes>
            </Subscription>
        </ApolloProvider>
    );
}
