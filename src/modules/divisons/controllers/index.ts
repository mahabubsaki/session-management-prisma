import catchAsync from "../../../utils/catchAsync";

const allDivisonsController = catchAsync(async (req, res, next) => {
    res.status(200).json({
        status: 'success',
        message: 'Divisons Controller'
    });
});

const postDivisonsController = catchAsync(async (req, res, next) => {
    res.status(200).json({
        status: 'success',
        message: 'Divisons Controller'
    });
});


export default { allDivisonsController, postDivisonsController };