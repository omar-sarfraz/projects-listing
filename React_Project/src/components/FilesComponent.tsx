import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { useField } from "formik";
import { Progress } from "@mantine/core";

import ConfirmationDialog from "./ConfirmationDialog";

import useAxios from "../hooks/useAxios";
import { useToast } from "../contexts/ToastContext";

export default function FilesComponent({ name }: { name: string }) {
    const [field, __, helper] = useField(name);

    const [uploadPercentage, setUploadPercentage] = useState(0);

    const axiosInstance = useAxios();
    const { toast } = useToast();

    const handleFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files?.length) return;

        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append("projectFiles", files[i]);
        }

        try {
            const response = await axiosInstance.post("/files", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (progressEvent) => {
                    const { loaded, total } = progressEvent;
                    if (!total) return;

                    const percent = Math.floor((loaded * 100) / total);
                    setUploadPercentage(percent);
                },
            });

            const paths = response.data.data;
            helper.setValue([...field.value, ...paths]);

            toast("Files uploaded Successfully", "success");
            setUploadPercentage(0);
        } catch (e) {
            console.log("An error has occured while uploading file", e);
            toast("An error has occured while uploading file", "error");
        }
    };

    const handleFileDelete = async (path: string) => {
        try {
            await axiosInstance.delete("/files", { data: { path } });
            toast("File deleted Successfully", "success");

            helper.setValue(field.value.filter((filePath: string) => filePath !== path));
        } catch (e) {
            console.log("An error has occured while deleting file");
        }
    };

    return (
        <>
            <div className="flex flex-col w-full items-start md:flex-row">
                <label className="w-full md:w-1/3 text-xl" htmlFor="projectFiles">
                    Upload relevant files
                </label>
                <div className="w-full md:w-2/3 ">
                    <div className="w-full mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 py-10">
                        <div className="text-center">
                            <svg
                                className="mx-auto h-12 w-12 text-gray-300"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                <label
                                    htmlFor="projectFiles"
                                    className="relative cursor-pointer rounded-md bg-white font-semibold text-emerald-600 focus-within:outline-none px-2"
                                >
                                    <span>Upload a file</span>
                                    <input
                                        className="sr-only"
                                        id="projectFiles"
                                        type="file"
                                        multiple
                                        onChange={handleFilesUpload}
                                    />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                        </div>
                    </div>
                    <div className="w-full mt-2">
                        {uploadPercentage ? (
                            <Progress value={uploadPercentage} color="cyan" />
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            </div>

            {field.value?.length ? (
                <div className="mt-4 flex gap-4 flex-wrap w-full">
                    {field.value.map((file: string) => (
                        <ConfirmationDialog
                            onClick={() => handleFileDelete(file)}
                            title="Confirm File Deletion"
                            description="Do you really want to delete this file?"
                            key={file}
                        >
                            <button
                                type="button"
                                className="flex gap-2 items-center border-[1px] py-1 px-2 rounded-md"
                            >
                                {file.split("/").pop()}
                                <Icon icon="line-md:close" />
                            </button>
                        </ConfirmationDialog>
                    ))}
                </div>
            ) : null}
        </>
    );
}
