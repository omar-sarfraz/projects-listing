import { Routes, Route } from "react-router-dom";
import { lazy, useEffect } from "react";

import Layout from "../pages/Layout";
const ProjectsList = lazy(() => import("../pages/ProjectsList/ProjectList"));
const SubmitProject = lazy(() => import("../pages/SubmitProject/SubmitProject"));
const NotFound = lazy(() => import("../pages/NotFound"));
const Login = lazy(() => import("../pages/Login/Login"));
const SignUp = lazy(() => import("../pages/SignUp/SignUp"));
const ProjectPage = lazy(() => import("../pages/ProjectPage/ProjectPage"));
const SubmitBid = lazy(() => import("../pages/SubmitBid/SubmitBid"));
const ChatPage = lazy(() => import("../pages/Chat/ChatPage"));

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";

import { WEBSOCKET_URL } from "../configs/urls";
import { Subscription } from "../components/Subscription";
import { useAuth } from "../contexts/AuthContext";

import { useAppDispatch } from "../redux/store";
import { listenProjectEvents } from "../redux/projects/slice";
import { listenOnlineStatus } from "../redux/onlineStatus/slice";

export default function MainNavigator() {
    const { user, loading } = useAuth();
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(listenProjectEvents());
        dispatch(listenOnlineStatus());
    }, []);

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
                                <Route path="projects/:id/chat" element={<ChatPage />} />
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
