"use client";

import { useState, useEffect } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, User, MapPin, Eye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  completeFormSchema,
  type CompleteForm,
} from "@/lib/validation";

const STORAGE_KEY = "user-form-data";

export default function AddUserPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<CompleteForm>>({});
  const router = useRouter();

  const steps = [
    { number: 1, title: "Basic Info", icon: User },
    { number: 2, title: "Address", icon: MapPin },
    { number: 3, title: "Review", icon: Eye },
    { number: 4, title: "Success", icon: Check },
  ];

  // Form for current step
  const form = useForm<CompleteForm>({
    resolver: zodResolver(completeFormSchema),
    defaultValues: formData as CompleteForm,
    mode: 'onChange',
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(parsed);
        form.reset(parsed);
      } catch (error) {
        console.error("Failed to parse saved form data:", error);
      }
    }
  }, [form]);

  // Save data to localStorage when formData changes
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    }
  }, [formData]);

  const nextStep = async () => {
    let isValid = false;

    if (currentStep === 1) {
      // Validate basic info fields only
      isValid = await form.trigger(['name', 'email', 'phone']);
    } else if (currentStep === 2) {
      // Validate address fields only
      isValid = await form.trigger(['street', 'city', 'zip']);
    } else {
      isValid = await form.trigger();
    }

    if (isValid) {
      const currentData = form.getValues();
      setFormData((prev) => ({ ...prev, ...currentData }));
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: CompleteForm) => {
    if (currentStep < 3) {
      await nextStep();
    } else if (currentStep === 3) {
      // Final submission
      const completeData = { ...formData, ...data };

      // Save to localStorage (users)
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      users.push({
        id: Date.now(),
        ...completeData,
      });
      localStorage.setItem("users", JSON.stringify(users));

      // Dispatch custom event to notify dashboard to refresh
      window.dispatchEvent(new CustomEvent('userAdded'));

      // Show success toast
      toast.success("User added successfully!");

      // Clear form progress
      localStorage.removeItem(STORAGE_KEY);
      setCurrentStep(4);
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Add New User</h1>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-4">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= step.number
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
                  }`}
              >
                {currentStep > step.number ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <step.icon className="h-5 w-5" />
                )}
              </div>
              <span className="ml-2 text-sm font-medium hidden sm:inline">
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div className="w-12 h-0.5 bg-muted ml-4 hidden sm:block" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Card */}
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>
              Step {currentStep}: {steps[currentStep - 1]?.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  {currentStep === 1 && <BasicInfoStep form={form} />}
                  {currentStep === 2 && <AddressStep form={form} />}
                  {currentStep === 3 && <ReviewStep formData={{ ...formData, ...form.getValues() } as CompleteForm} />}
                  {currentStep === 4 && (
                    <SuccessStep
                      onAddAnother={() => {
                        setFormData({});
                        form.reset({});
                        setCurrentStep(1);
                      }}
                      onGoDashboard={() => router.push("/dashboard")}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
              {/* Navigation Buttons */}
              {currentStep < 4 && (
                <div className="flex justify-between mt-8">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  <Button type="submit">
                    {currentStep === 3 ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Submit
                      </>
                    ) : (
                      <>
                        Next
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function BasicInfoStep({ form }: { form: UseFormReturn<CompleteForm> }) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          {...form.register("name")}
          placeholder="Enter full name"
        />
        {form.formState.errors.name && (
          <p className="text-sm text-red-500 mt-1">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...form.register("email")}
          placeholder="Enter email address"
        />
        {form.formState.errors.email && (
          <p className="text-sm text-red-500 mt-1">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="phone">Mobile Number</Label>
        <Input
          id="phone"
          type="tel"
          {...form.register("phone")}
          placeholder="Enter mobile number"
        />
        {form.formState.errors.phone && (
          <p className="text-sm text-red-500 mt-1">
            {form.formState.errors.phone.message}
          </p>
        )}
      </div>
    </div>
  );
}

function AddressStep({ form }: { form: UseFormReturn<CompleteForm> }) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="street">Street Address</Label>
        <Input
          id="street"
          {...form.register("street")}
          placeholder="Enter street address"
        />
        {form.formState.errors.street && (
          <p className="text-sm text-red-500 mt-1">
            {form.formState.errors.street.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="city">City</Label>
        <Input
          id="city"
          {...form.register("city")}
          placeholder="Enter city"
        />
        {form.formState.errors.city && (
          <p className="text-sm text-red-500 mt-1">
            {form.formState.errors.city.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="zip">ZIP Code</Label>
        <Input
          id="zip"
          {...form.register("zip")}
          placeholder="Enter ZIP code"
        />
        {form.formState.errors.zip && (
          <p className="text-sm text-red-500 mt-1">
            {form.formState.errors.zip.message}
          </p>
        )}
      </div>
    </div>
  );
}

function ReviewStep({ formData }: { formData: CompleteForm }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">Review Your Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><span className="font-medium">Name:</span> {formData.name}</p>
                <p><span className="font-medium">Email:</span> {formData.email}</p>
                <p><span className="font-medium">Phone:</span> {formData.phone}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><span className="font-medium">Street:</span> {formData.street}</p>
                <p><span className="font-medium">City:</span> {formData.city}</p>
                <p><span className="font-medium">ZIP:</span> {formData.zip}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function SuccessStep({ onAddAnother, onGoDashboard }: { onAddAnother: () => void; onGoDashboard: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-8">
      <Check className="h-12 w-12 text-green-500 mb-2" />
      <h2 className="text-2xl font-bold mb-2">User Added Successfully!</h2>
      <div className="flex gap-4 mt-4">
        <Button onClick={onGoDashboard} variant="default">Go to Dashboard</Button>
        <Button onClick={onAddAnother} variant="outline">Add Another User</Button>
      </div>
    </div>
  );
}
