import Joi from "joi";

const bidSchema = Joi.object({
    budget: Joi.number().required(),
    deadline: Joi.date().required(),
    description: Joi.string().required(),
    userId: Joi.number().required(),
});

export default bidSchema;
