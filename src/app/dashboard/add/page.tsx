"use client";

import React, { useState, useEffect } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, User, MapPin, Eye, Plus } from "lucide-react";
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
    let fieldsToValidate: (keyof CompleteForm)[] = [];

    if (currentStep === 1) {
      // Validate basic info fields only
      fieldsToValidate = ['name', 'email', 'phone'];
    } else if (currentStep === 2) {
      // Validate address fields only
      fieldsToValidate = ['street', 'city', 'zip'];
    }

    if (fieldsToValidate.length > 0) {
      isValid = await form.trigger(fieldsToValidate);
    } else {
      isValid = await form.trigger();
    }

    console.log('Form validation result:', isValid);
    console.log('Fields validated:', fieldsToValidate);
    console.log('Form errors:', form.formState.errors);

    if (isValid) {
      const currentData = form.getValues();
      console.log('Current form data:', currentData);
      setFormData((prev) => ({ ...prev, ...currentData }));
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    } else {
      // Show which fields are invalid
      const errors = form.formState.errors;
      console.log('Validation failed. Errors:', errors);

      // Show toast for validation errors
      if (Object.keys(errors).length > 0) {
        const firstError = Object.values(errors)[0];
        toast.error(firstError?.message || 'Please fix the form errors before continuing');
      }
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: CompleteForm) => {
    console.log('Form submitted with data:', data);
    console.log('Current step:', currentStep);

    if (currentStep === 1 || currentStep === 2) {
      // For steps 1 and 2, move to next step
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
    <div className="min-h-full bg-background">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="outline" size="icon" className="h-10 w-10">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Add New User</h1>
            <p className="text-muted-foreground mt-1">Fill in the information to create a new user account</p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-center mb-12">
        <div className="flex items-center space-x-2 sm:space-x-4 bg-card rounded-lg p-4 border-2 shadow-sm">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-200 ${currentStep >= step.number
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-background text-muted-foreground border-border hover:border-muted-foreground"
                    }`}
                >
                  {currentStep > step.number ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                <span className={`mt-2 text-xs font-medium ${currentStep >= step.number ? "text-foreground" : "text-muted-foreground"
                  }`}>
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-8 sm:w-16 h-0.5 mx-2 sm:mx-4 transition-colors duration-200 ${currentStep > step.number ? "bg-primary" : "bg-border"
                  }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Card */}
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-xl border-2 hover:shadow-2xl transition-all duration-300 bg-card">
          <CardHeader className="pb-6 bg-gradient-to-r from-card to-muted/20 rounded-t-lg border-b">
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center">
                {React.createElement(steps[currentStep - 1]?.icon, { className: "h-5 w-5 text-primary" })}
              </div>
              Step {currentStep}: {steps[currentStep - 1]?.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-8 pb-8 pt-8">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                <div className="flex justify-between mt-10 pt-8 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="min-w-[140px] h-12"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  <Button
                    type="button"
                    onClick={currentStep === 3 ? form.handleSubmit(onSubmit) : nextStep}
                    className="min-w-[140px] h-12"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? (
                      <>
                        <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Processing...
                      </>
                    ) : currentStep === 3 ? (
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
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-xl font-bold text-foreground mb-2">Personal Information</h3>
        <p className="text-muted-foreground">Please provide your basic personal details</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="name" className="text-sm font-semibold text-foreground flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            Full Name *
          </Label>
          <Input
            id="name"
            {...form.register("name")}
            placeholder="Enter your full name"
            className={`h-14 px-4 text-base border-2 transition-all duration-200 ${form.formState.errors.name
                ? "border-red-500 focus:border-red-500 bg-red-50 dark:bg-red-950/20"
                : "focus:border-primary hover:border-muted-foreground"
              }`}
          />
          {form.formState.errors.name && (
            <p className="text-sm text-red-500 mt-2 flex items-center gap-2 bg-red-50 dark:bg-red-950/20 p-2 rounded-md">
              <span className="text-xs">⚠</span>
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <Label htmlFor="email" className="text-sm font-semibold text-foreground flex items-center gap-2">
            <span className="text-primary">@</span>
            Email Address *
          </Label>
          <Input
            id="email"
            type="email"
            {...form.register("email")}
            placeholder="Enter your email address"
            className={`h-14 px-4 text-base border-2 transition-all duration-200 ${form.formState.errors.email
                ? "border-red-500 focus:border-red-500 bg-red-50 dark:bg-red-950/20"
                : "focus:border-primary hover:border-muted-foreground"
              }`}
          />
          {form.formState.errors.email && (
            <p className="text-sm text-red-500 mt-2 flex items-center gap-2 bg-red-50 dark:bg-red-950/20 p-2 rounded-md">
              <span className="text-xs">⚠</span>
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <Label htmlFor="phone" className="text-sm font-semibold text-foreground flex items-center gap-2">
            <span className="text-primary">📱</span>
            Mobile Number *
          </Label>
          <Input
            id="phone"
            type="tel"
            {...form.register("phone")}
            placeholder="Enter your mobile number"
            className={`h-14 px-4 text-base border-2 transition-all duration-200 ${form.formState.errors.phone
                ? "border-red-500 focus:border-red-500 bg-red-50 dark:bg-red-950/20"
                : "focus:border-primary hover:border-muted-foreground"
              }`}
          />
          {form.formState.errors.phone && (
            <p className="text-sm text-red-500 mt-2 flex items-center gap-2 bg-red-50 dark:bg-red-950/20 p-2 rounded-md">
              <span className="text-xs">⚠</span>
              {form.formState.errors.phone.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function AddressStep({ form }: { form: UseFormReturn<CompleteForm> }) {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-xl font-bold text-foreground mb-2">Address Information</h3>
        <p className="text-muted-foreground">Please provide your address details</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="street" className="text-sm font-semibold text-foreground flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            Street Address *
          </Label>
          <Input
            id="street"
            {...form.register("street")}
            placeholder="Enter your street address"
            className={`h-14 px-4 text-base border-2 transition-all duration-200 ${form.formState.errors.street
                ? "border-red-500 focus:border-red-500 bg-red-50 dark:bg-red-950/20"
                : "focus:border-primary hover:border-muted-foreground"
              }`}
          />
          {form.formState.errors.street && (
            <p className="text-sm text-red-500 mt-2 flex items-center gap-2 bg-red-50 dark:bg-red-950/20 p-2 rounded-md">
              <span className="text-xs">⚠</span>
              {form.formState.errors.street.message}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <Label htmlFor="city" className="text-sm font-semibold text-foreground flex items-center gap-2">
            <span className="text-primary">🏙️</span>
            City *
          </Label>
          <Input
            id="city"
            {...form.register("city")}
            placeholder="Enter your city"
            className={`h-14 px-4 text-base border-2 transition-all duration-200 ${form.formState.errors.city
                ? "border-red-500 focus:border-red-500 bg-red-50 dark:bg-red-950/20"
                : "focus:border-primary hover:border-muted-foreground"
              }`}
          />
          {form.formState.errors.city && (
            <p className="text-sm text-red-500 mt-2 flex items-center gap-2 bg-red-50 dark:bg-red-950/20 p-2 rounded-md">
              <span className="text-xs">⚠</span>
              {form.formState.errors.city.message}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <Label htmlFor="zip" className="text-sm font-semibold text-foreground flex items-center gap-2">
            <span className="text-primary">📮</span>
            ZIP Code *
          </Label>
          <Input
            id="zip"
            {...form.register("zip")}
            placeholder="Enter your ZIP code"
            className={`h-14 px-4 text-base border-2 transition-all duration-200 ${form.formState.errors.zip
                ? "border-red-500 focus:border-red-500 bg-red-50 dark:bg-red-950/20"
                : "focus:border-primary hover:border-muted-foreground"
              }`}
          />
          {form.formState.errors.zip && (
            <p className="text-sm text-red-500 mt-2 flex items-center gap-2 bg-red-50 dark:bg-red-950/20 p-2 rounded-md">
              <span className="text-xs">⚠</span>
              {form.formState.errors.zip.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function ReviewStep({ formData }: { formData: CompleteForm }) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-xl font-bold text-foreground mb-2">Review Your Information</h3>
        <p className="text-muted-foreground">Please review your details before submitting</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-2 hover:shadow-lg transition-all duration-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="font-medium text-muted-foreground">Name:</span>
              <span className="font-semibold">{formData.name}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="font-medium text-muted-foreground">Email:</span>
              <span className="font-semibold">{formData.email}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="font-medium text-muted-foreground">Phone:</span>
              <span className="font-semibold">{formData.phone}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-all duration-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Address Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="font-medium text-muted-foreground">Street:</span>
              <span className="font-semibold">{formData.street}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="font-medium text-muted-foreground">City:</span>
              <span className="font-semibold">{formData.city}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="font-medium text-muted-foreground">ZIP:</span>
              <span className="font-semibold">{formData.zip}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-muted/30 rounded-lg p-4 border border-border">
        <p className="text-sm text-muted-foreground text-center">
          <span className="font-medium">Note:</span> Please ensure all information is correct before submitting.
          You can go back to make changes if needed.
        </p>
      </div>
    </div>
  );
}

function SuccessStep({ onAddAnother, onGoDashboard }: { onAddAnother: () => void; onGoDashboard: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-12">
      <div className="relative">
        <div className="h-20 w-20 bg-green-500/10 rounded-full flex items-center justify-center">
          <Check className="h-12 w-12 text-green-500" />
        </div>
        <div className="absolute -top-1 -right-1 h-6 w-6 bg-green-500 rounded-full flex items-center justify-center">
          <Check className="h-4 w-4 text-white" />
        </div>
      </div>

      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold text-foreground">Success!</h2>
        <p className="text-lg text-muted-foreground">User has been added successfully</p>
        <p className="text-sm text-muted-foreground max-w-md">
          The new user has been saved and is now available in your dashboard.
          You can view all users or add another one.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Button
          onClick={onGoDashboard}
          variant="default"
          className="min-w-[160px] h-12 text-base"
        >
          <User className="h-4 w-4 mr-2" />
          View Dashboard
        </Button>
        <Button
          onClick={onAddAnother}
          variant="outline"
          className="min-w-[160px] h-12 text-base"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Another User
        </Button>
      </div>
    </div>
  );
}
