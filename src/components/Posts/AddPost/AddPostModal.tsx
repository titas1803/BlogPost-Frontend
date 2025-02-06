import { yupResolver } from "@hookform/resolvers/yup";
import React, { useRef, useState } from "react";
import { Modal, FloatingLabel, Carousel, Button, Form } from "react-bootstrap";
import { FieldErrors, SubmitHandler, useForm } from "react-hook-form";
import { FaPenNib } from "react-icons/fa";
import { IoIosCloseCircleOutline, IoIosImages } from "react-icons/io";
import { mixed, string as yupString, object as yupObject } from "yup";
import AddImg from "/src/assets/icons8-plus-128.png";
import { AddPostModalStyles } from "./styles";
import axios from "axios";
import { useSelector } from "react-redux";
import { ILoginState } from "@/Utilities/Types";
import toast from "react-hot-toast";

type Props = {
  show: boolean;
  onHide: () => void;
};

type PostFields = {
  title: string;
  content: string;
  images?: FileList;
  tags?: string;
  categories?: string;
};

const maxFileSize = 2 * 1024 * 1024; // 2 MB
const allowedFileTypes = ["image/jpeg", "image/png", "image/gif"];
const maxImages = 5;

const validationSchema = yupObject().shape({
  title: yupString().required("Please add a tiitle of your blog"),
  content: yupString()
    .required("Please add some content")
    .test("maxWordCount", "Max 300 words are allowed", (value) => {
      if (value.length) {
        return value.split(" ").length <= 300;
      }
    }),
  images: mixed<FileList>()
    .test("fileType", "Only JPEG, PNG, and GIF files are allowed.", (value) => {
      if (!value) return true; // Skip validation if no file is uploaded
      return Array.from(value as FileList).every((file: File) =>
        allowedFileTypes.includes(file.type)
      );
    })
    .test("fileSize", "Each file must be less than 2 MB.", (value) => {
      if (!value) return true;
      return Array.from(value as FileList).every(
        (file: File) => file.size <= maxFileSize
      );
    })
    .test(
      "maxFiles",
      `You can only upload up to ${maxImages} images.`,
      (value) => {
        if (!value) return true;
        return value.length <= maxImages;
      }
    ),
});

export const AddPostModal: React.FC<Props> = ({ show, onHide }) => {
  const [images, setImages] = useState<Array<string>>([]);
  const [addingImages, setAddingImages] = useState(false);
  const addImageRef = useRef<HTMLInputElement>(null);

  const { register, setValue, getValues, handleSubmit, reset } =
    useForm<PostFields>({
      mode: "all",
      reValidateMode: "onChange",
      resolver: yupResolver(validationSchema),
    });

  const { "auth-token": authToken } = useSelector(
    (state: { login: ILoginState }) => state.login
  );

  const removeAllImages = () => {
    setImages([]);
    setValue("images", undefined);
    setAddingImages(false);
  };

  const removeImage = (index: number) => {
    const updatedFiles = new DataTransfer();
    const currentFiles = addImageRef.current?.files;
    if (currentFiles) {
      Array.from(currentFiles).forEach((file, idx) => {
        if (idx !== index) {
          updatedFiles.items.add(file);
        }
      });
      setValue("images", updatedFiles.files);
    }
    const newImageArray = images.toSpliced(index, 1);
    setImages(newImageArray);
    if (newImageArray.length === 0) {
      setAddingImages(false);
    }
  };

  const addImageClick = () => {
    addImageRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      const imageUrls = filesArray.map((file) => URL.createObjectURL(file));
      setImages((prevImages) => {
        const newimages = [...prevImages, ...imageUrls];
        return newimages;
      });
      const currentValues = getValues("images");
      const newFileList = new DataTransfer();
      if (currentValues) {
        Array.from(currentValues).forEach((file) =>
          newFileList.items.add(file)
        );
      }
      filesArray.forEach((file) => newFileList.items.add(file));
      setValue("images", newFileList.files);
    }
  };

  const createPost: SubmitHandler<PostFields> = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    if (data.images) {
      Array.from(data.images).forEach((image) => {
        formData.append("images", image);
      });
    }
    if (data.tags) {
      formData.append("tags", data.tags);
    }
    if (data.categories) {
      formData.append("categories", data.categories);
    }
    formData.append("isPublished", "true");
    try {
      const CREATEURL =
        import.meta.env.BLOGPOST_FRONTEND_API_URL + "/post/create";
      const response = await axios.post(CREATEURL, formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success("post created successfully");
        reset();
        setImages([]);
        setAddingImages(false);
        onHide();
        window.location.reload();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(`Error occurred, ${error.response?.data.message}`);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };

  const onError = (error: FieldErrors<PostFields>) => {
    console.log(error);
  };

  return (
    <AddPostModalStyles>
      <Modal show={show} centered onHide={onHide} backdrop="static">
        <Modal.Header closeButton>
          <span className="me-2">
            <FaPenNib />
          </span>
          <h3>Create a Blog</h3>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(createPost, onError)}>
            <fieldset className="border-bottom">
              <FloatingLabel
                label="Add a title"
                controlId="postTitle"
                className="my-2"
              >
                <Form.Control
                  type="text"
                  placeholder="add a title..."
                  {...register("title")}
                  autoFocus
                />
              </FloatingLabel>
              <FloatingLabel
                label="Add blog content"
                controlId="postContent"
                className="my-2"
              >
                <Form.Control
                  as="textarea"
                  placeholder="add blog content..."
                  rows={10}
                  {...register("content")}
                />
                <Form.Text>Maximun 300 words.</Form.Text>
              </FloatingLabel>
              {addingImages ? (
                <div className="my-2">
                  <Carousel wrap={false} interval={null}>
                    {images.map((image, index) => (
                      <Carousel.Item key={`upload-${index}`}>
                        <div className="carousel-content d-flex justify-content-center">
                          <img
                            src={image}
                            alt={`blog image ${index}`}
                            width={200}
                            height={200}
                          />
                          <Button onClick={() => removeImage(index)}>×</Button>
                        </div>
                      </Carousel.Item>
                    ))}
                    <Carousel.Item>
                      <div className="carousel-content d-flex justify-content-center">
                        <Button
                          variant="outline-secondary"
                          onClick={addImageClick}
                          className="p-0 border-0 rounded-circle"
                        >
                          <img
                            src={AddImg}
                            alt="add image"
                            width={200}
                            height={200}
                          />
                        </Button>
                        <Form.Group className="d-none">
                          <Form.Control
                            type="file"
                            multiple
                            accept="image/*"
                            {...register("images", {
                              onChange: (e) => {
                                handleImageChange(e);
                              },
                            })}
                            ref={addImageRef}
                          />
                        </Form.Group>
                      </div>
                    </Carousel.Item>
                  </Carousel>
                  <Button onClick={removeAllImages} variant="outline-dark">
                    <IoIosCloseCircleOutline />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => {
                    setAddingImages(true);
                    addImageClick();
                  }}
                  variant="outline-dark"
                  className="my-2"
                >
                  Add Images <IoIosImages />
                </Button>
              )}
              <FloatingLabel
                className="mb-3"
                controlId="post-tags"
                label="Add some tags"
              >
                <Form.Control
                  type="text"
                  placeholder="tags..."
                  {...register("tags")}
                />
                <Form.Text as="p" muted className="m-0">
                  Add the tags with a prefix of '#' and separated by 'space'.
                  <br />
                  (example: #adventure #travel)
                </Form.Text>
              </FloatingLabel>
              <FloatingLabel
                label="Add some categories"
                className="mb-3"
                controlId="post-categories"
              >
                <Form.Control
                  type="text"
                  placeholder="categories..."
                  {...register("categories")}
                />
                <Form.Text as="p" muted className="m-0">
                  Add the categories separated by '<strong>,</strong>'
                  <br />
                  (example: adventure, travel)
                </Form.Text>
              </FloatingLabel>
            </fieldset>
            <Form.Group
              controlId="formActions"
              className="mt-3 d-flex justify-content-end"
            >
              <Button type="submit" variant="success" className="mx-2 px-3">
                Post
              </Button>
              <Button type="submit" className="mx-2" variant="light">
                Save as Draft
              </Button>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </AddPostModalStyles>
  );
};
