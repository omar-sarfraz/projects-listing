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

import { ApolloProvider } from "@apollo/client";

import { Subscription } from "../components/Subscription";
import { useAuth } from "../contexts/AuthContext";

import { useAppDispatch } from "../redux/store";
import { listenEvents } from "../redux/events/slice";
import { listenOnlineStatus } from "../redux/onlineStatus/slice";
import useGraphQL from "../hooks/useGraphQL";

export default function MainNavigator() {
    const { user, loading } = useAuth();
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(listenEvents());
        dispatch(listenOnlineStatus());
    }, []);

    if (loading) return <div>Loading</div>;

    const client = useGraphQL(user);

    return (
        <ApolloProvider client={client}>
            <Subscription>
                {(resubscribe) => (
                    <Routes>
                        <Route path="/" element={<Layout />}>
                            {user ? (
                                <>
                                    <Route index element={<ProjectsList />} />
                                    <Route
                                        path="projects/submit"
                                        element={<SubmitProject resubscribe={resubscribe} />}
                                    />
                                    <Route path="projects/:id" element={<ProjectPage />} />
                                    <Route
                                        path="projects/:id/bid"
                                        element={<SubmitBid resubscribe={resubscribe} />}
                                    />
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
                )}
            </Subscription>
        </ApolloProvider>
    );
}
