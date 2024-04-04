import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import authService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",
            content: post?.content || "",
            status: post?.status || "active",
        },
    });

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);
    const user = useSelector((state) => state.auth.status);
    console.log(user);
    console.log(userData)
    // const submit = async (data) => {
    //     console.log("hey");
    //     console.log(data);
    //     if (post) {
    //         const file = data.image[0] ? await appwriteauthService.uploadFile(data.image[0]) : null;

    //         if (file) {
    //             appwriteauthService.deleteFile(post.featuredimage);
    //         }

    //         const dbPost = await appwriteauthService.updatePost(post.$id, {
    //             ...data,
    //             featuredimage: file ? file.$id : undefined,
    //         });

    //         if (dbPost) {
    //             navigate(`/post/${dbPost.$id}`);
    //         }
    //     } else {
    //         const file = await appwriteauthService.uploadFile(data.image[0]);

    //         if (file) {
    //             const fileId = file.$id;
    //             data.featuredimage = fileId;
    //             const dbPost = await appwriteauthService.createPost({ ...data, user: userData.$id });

    //             if (dbPost) {
    //                 navigate(`/post/${dbPost.$id}`);
    //             }
    //         }
    //     }
    // };
    const editpost = async(data) => {

        const file = data.image[0]
          ? await authService.uploadFile(data.image[0])
          : null;
        if (file) {
          authService.deleteFile(post.featuredimage);
        }
        const dbPost = await authService.updatePost(post.$id, {
          ...data,
          featuredimage: file ? file.$id : undefined,
        });
        console.log(dbPost);
        if (dbPost) {
          navigate(`/post/${dbPost.$id}`);
        }
    }
  
    const addPost = async (data) => {
        console.log(data);
      console.log("addPost")
        const file = await authService.uploadFile(data.image[0]);
        console.log(file);
        if (file) {
          const fileId = file.$id;
          console.log(fileId, "hello");
          data.featuredimage = fileId;
          const dbPost = await authService.createPost({
            ...data,
            featuredimage: data.featuredimage,
            user: "660eb54c20d13151533a",
          });
          console.log({ ...data });
          console.log(dbPost.$id);
          
  
          if (dbPost) {
            navigate(`/post/${dbPost.$id}`);
          }
        }
        
      
    }; 
    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");

        return "";
    }, []);

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });
            
        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);
    
    // const handleForm = ()=>{
    //     console.log("clicked");
    // } 
    return (
        <form onSubmit={handleSubmit(post?editpost:addPost)} className="flex flex-wrap">
            <div className="w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                {/* <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} /> */}
            </div>
            <div className="w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                {post && (
                    <div className="w-full mb-4">
                        <img
                            src={authService.getFilePreview(post.featuredimage)}
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    );
}