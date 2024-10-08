import Joi from "joi";

const projectSchema = Joi.object({
    name: Joi.string().required(),
    budget: Joi.number().required(),
    deadline: Joi.date().required(),
    description: Joi.string().required(),
    userId: Joi.number().required(),
    files: Joi.array().items(Joi.string()),
});

export default projectSchema;
