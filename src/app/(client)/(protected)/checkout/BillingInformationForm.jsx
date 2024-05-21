"use client";
import Image from "next/image";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { LuCreditCard, LuDollarSign } from "react-icons/lu";
import { amazonPaymentImg, paypal2PaymentImg } from "@/assets/data/images";
import {
  DateFormInput,
  SelectFormInput,
  TextAreaFormInput,
  TextFormInput,
} from "@/components";
import OrderSummary from "./OrderSummary";

const BillingInformation = () => {
  const billingFormSchema = yup.object({
    fname: yup.string().required("Please enter your user name"),
    lName: yup.string().required("Please enter your Last Name"),
    address: yup.string().required("Please enter your Address"),
    email: yup
      .string()
      .email("Please enter a valid email")
      .required("Please enter your email"),
    phoneNo: yup.number().required("Please enter your Phone NO."),
    message: yup.string().optional(),
  });

  const onSubmit = async (data) => {
    try {
      // Make sure the form is valid

      // Make an HTTP POST request to your server endpoint
      //const response = await axios.post("YOUR_SERVER_ENDPOINT_URL", data);

      // Handle the response if needed
      console.log("Server response:", JSON.stringify(data));
    } catch (error) {
      // Handle errors if the request fails
      console.error("Error:", error);
    }
  };

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(billingFormSchema),
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-6 lg:grid-cols-3"
    >
      <div className="col-span-1 lg:col-span-2">
        <div className="mb-8">
          <h4 className="mb-6 text-lg font-medium text-default-800">
            Billing Information
          </h4>
          <div className="grid gap-6 lg:grid-cols-3">
            <TextFormInput
              name="fname"
              type="text"
              label="First name"
              placeholder="First Name"
              control={control}
              fullWidth
            />

            <TextFormInput
              name="lName"
              type="text"
              label="Last Name"
              placeholder="Last Name"
              control={control}
              fullWidth
            />

            <TextAreaFormInput
              name="address"
              label="Address"
              placeholder="Enter Your Address"
              containerClassName="lg:col-span-4"
              control={control}
              fullWidth
            />

            <TextFormInput
              name="email"
              type="text"
              label="Email"
              className="block w-full rounded-lg border border-default-200 bg-transparent px-4 py-2.5 dark:bg-default-50"
              placeholder="example@example.com"
              containerClassName="lg:col-span-2"
              control={control}
            />

            <TextFormInput
              name="phoneNo"
              type="text"
              label="Phone Number"
              className="block w-full rounded-lg border border-default-200 bg-transparent px-4 py-2.5 dark:bg-default-50"
              placeholder="+1  123-XXX-7890"
              containerClassName="lg:col-span-2"
              control={control}
            />

            <div className="flex items-center">
              <input
                id="shipmentAddress"
                className="h-5 w-5 rounded border-default-200 bg-transparent text-primary focus:ring-0"
                type="checkbox"
                placeholder="+1  123-XXX-7890"
              />
              <label
                htmlFor="shipmentAddress"
                className="ms-2 block text-sm text-default-700"
              >
                Ship into different address{" "}
              </label>
            </div>
          </div>
        </div>
        <div className="mb-8">
          <h4 className="mb-6 text-lg font-medium text-default-800">
            Payment Option
          </h4>
          <div className="mb-5 rounded-lg border border-default-200 p-6 lg:w-5/6">
            <div className="grid grid-cols-2 lg:grid-cols-2">
              <div className="p-6 text-center">
                <label
                  htmlFor="paymentCOD"
                  className="mb-4 flex flex-col items-center justify-center"
                >
                  <LuDollarSign className="mb-4 text-primary" size={24} />
                  <h5 className="text-sm font-medium text-default-700">
                    Cash on Delivery
                  </h5>
                </label>
                <input
                  id="paymentCOD"
                  className="h-5 w-5 border-default-200 bg-transparent text-primary focus:ring-0"
                  type="radio"
                  name="paymentOption"
                  defaultChecked
                />
              </div>

              <div className="p-6 text-center">
                <label
                  htmlFor="paymentCard"
                  className="mb-4 flex flex-col items-center justify-center"
                >
                  <LuCreditCard className="mb-4 text-primary" size={24} />
                  <h5 className="text-sm font-medium text-default-700">
                    Debit/Credit Card
                  </h5>
                </label>
                <input
                  id="paymentCard"
                  className="h-5 w-5 border-default-200 bg-transparent text-primary focus:ring-0"
                  type="radio"
                  name="paymentOption"
                />
              </div>
            </div>
          </div>
        </div>
        <div>
          <h4 className="mb-6 text-lg font-medium text-default-800">
            Additional Information
          </h4>

          <TextAreaFormInput
            name="message"
            label="Message (optional)"
            placeholder="Notes about your order, e.g. special notes for delivery"
            control={control}
            fullWidth
          />
        </div>
      </div>

      <OrderSummary />
    </form>
  );
};

export default BillingInformation;
