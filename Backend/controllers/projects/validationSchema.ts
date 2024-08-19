import Joi from "joi";

const projectSchema = Joi.object({
    name: Joi.string().required(),
    budget: Joi.number().required(),
    deadline: Joi.date().required(),
    description: Joi.string().required(),
    userId: Joi.number().required(),
});

export default projectSchema;
