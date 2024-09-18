import Joi from "joi";

const commentSchema = Joi.object({
    text: Joi.string().required(),
    userId: Joi.number().required(),
});

export default commentSchema;
