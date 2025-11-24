"use client";
import * as z from "zod";
import { formSchema } from "@/lib/form-schema";
import { serverAction } from "@/actions/server-action";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { useAction } from "next-safe-action/hooks";
import { motion } from "motion/react";
import { Check, MapPin, Loader2, Upload, Mic } from "lucide-react";
import { useState, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import {
  Field,
  FieldGroup,
  FieldContent,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Schema = z.infer<typeof formSchema>;

export function DreamForm() {
  const [open, setOpen] = useState(false);
  const form = useForm<Schema>({
    resolver: zodResolver(formSchema as any),
    defaultValues: {
      description: "",
      location: "",
      type: [],
      recurring: false,
    },
  });

  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      form.setValue("description", transcript);
    }
  }, [transcript, form]);

  const handleGetLocation = () => {
    setIsLoadingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          form.setValue("latitude", latitude);
          form.setValue("longitude", longitude);

          try {
            const response = await fetch("/api/gemini/location", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ latitude, longitude }),
            });

            if (response.ok) {
              const data = await response.json();
              form.setValue("location", data.location);
            } else {
              const errorData = await response.json();
              console.error("Failed to get location from Gemini:", errorData);
            }
          } catch (error) {
            console.error("Error fetching location:", error);
          } finally {
            setIsLoadingLocation(false);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setIsLoadingLocation(false);
        }
      );
    } else {
      console.error("Geolocation not supported");
      setIsLoadingLocation(false);
    }
  };

  const formAction = useAction(serverAction, {
    onSuccess: () => {
      // TODO: show success message
      form.reset();
    },
    onError: () => {
      // TODO: show error message
    },
  });
  const handleSubmit = form.handleSubmit(async (data: Schema) => {
    formAction.execute(data);
  });

  const { isExecuting, hasSucceeded } = formAction;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full shadow-lg h-12 px-6">
          <Upload className="mr-2 h-4 w-4" /> Upload Dream
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Dream</DialogTitle>
        </DialogHeader>
        {hasSucceeded ? (
          <div className="p-2 sm:p-5 md:p-8 w-full rounded-md gap-2">
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, stiffness: 300, damping: 25 }}
              className="h-full py-6 px-3"
            >
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.3,
                  type: "spring",
                  stiffness: 500,
                  damping: 15,
                }}
                className="mb-4 flex justify-center border rounded-full w-fit mx-auto p-2"
              >
                <Check className="size-8" />
              </motion.div>
              <h2 className="text-center text-2xl text-pretty font-bold mb-2">
                Dream Uploaded
              </h2>
              <p className="text-center text-lg text-pretty text-muted-foreground">
                Dream form submitted successfully, you will see it soon!
              </p>
            </motion.div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col w-full gap-2">
            <FieldGroup>
              <h1 className="mt-6 mb-1 font-extrabold text-3xl tracking-tight">
                Upload Dream
              </h1>

              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-1">
                    <div className="flex justify-between items-center">
                      <FieldLabel htmlFor="description">
                        Description *
                      </FieldLabel>
                      {browserSupportsSpeechRecognition && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (listening) {
                              SpeechRecognition.stopListening();
                            } else {
                              SpeechRecognition.startListening({
                                continuous: true,
                              });
                            }
                          }}
                          className={
                            listening ? "text-red-500 animate-pulse" : ""
                          }
                          title={
                            listening ? "Stop recording" : "Start recording"
                          }
                        >
                          <Mic className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <Textarea
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id="description"
                      placeholder="Enter your text"
                    />
                    <FieldDescription>
                      Describe your dream as best as you can
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="location"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-1">
                    <FieldLabel htmlFor="location">Location *</FieldLabel>
                    <Input
                      {...field}
                      id="location"
                      type="text"
                      onChange={(e) => {
                        field.onChange(e.target.value);
                      }}
                      aria-invalid={fieldState.invalid}
                      placeholder="Toronto, Canada"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2 w-fit"
                      onClick={handleGetLocation}
                      disabled={isLoadingLocation}
                    >
                      {isLoadingLocation ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Getting location...
                        </>
                      ) : (
                        <>
                          <MapPin className="mr-2 h-4 w-4" />
                          Get Current Location
                        </>
                      )}
                    </Button>
                    <FieldDescription>
                      The city and country where this dream took place
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="dateTime"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-1">
                    <FieldLabel htmlFor="dateTime">
                      Date and Time of Dream *
                    </FieldLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP HH:mm")
                          ) : (
                            <span>Pick a date and time</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          fixedWeeks
                          selected={field.value}
                          onSelect={(date) => {
                            if (!date) return;
                            const newDate = new Date(date);
                            if (field.value) {
                              newDate.setHours(field.value.getHours());
                              newDate.setMinutes(field.value.getMinutes());
                            }
                            newDate.setSeconds(0);
                            newDate.setMilliseconds(0);
                            field.onChange(newDate);
                          }}
                          initialFocus
                        />
                        <div className="p-3 border-t border-border">
                          <Input
                            type="time"
                            step="60"
                            value={
                              field.value ? format(field.value, "HH:mm") : ""
                            }
                            onChange={(e) => {
                              const time = e.target.value;
                              if (!time) return;
                              const [hours, minutes] = time
                                .split(":")
                                .map(Number);
                              const newDate = field.value
                                ? new Date(field.value)
                                : new Date();
                              newDate.setHours(hours);
                              newDate.setMinutes(minutes);
                              newDate.setSeconds(0);
                              newDate.setMilliseconds(0);
                              field.onChange(newDate);
                            }}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FieldDescription>
                      When did your dream take place?
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="type"
                control={form.control}
                render={({ field, fieldState }) => {
                  const options = [
                    { value: "normal", label: "Normal" },
                    { value: "nightmare", label: "Nightmare" },
                    { value: "lucid", label: "Lucid" },
                    { value: "sleep paralysis", label: "Sleep Paralysis" },
                    { value: "daydream", label: "Daydream" },
                  ];
                  return (
                    <Field
                      data-invalid={fieldState.invalid}
                      className="gap-0 [&_p]:pb-1"
                    >
                      <FieldLabel htmlFor="type">Dream Type *</FieldLabel>
                      <FieldDescription>
                        What type of dream did you have?
                      </FieldDescription>
                      <MultiSelect
                        values={field.value ?? []}
                        onValuesChange={(value) => field.onChange(value ?? [])}
                      >
                        <MultiSelectTrigger>
                          <MultiSelectValue placeholder="Nightmare" />
                        </MultiSelectTrigger>
                        <MultiSelectContent>
                          {options.map(({ label, value }) => (
                            <MultiSelectItem key={value} value={value}>
                              {label}
                            </MultiSelectItem>
                          ))}
                        </MultiSelectContent>
                      </MultiSelect>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  );
                }}
              />

              <Controller
                name="recurring"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    orientation="horizontal"
                    data-invalid={fieldState.invalid}
                  >
                    <FieldContent>
                      <FieldLabel htmlFor="recurring">
                        Recurring Dream? *
                      </FieldLabel>
                      <FieldDescription>
                        Has this dream happened before?
                      </FieldDescription>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </FieldContent>
                    <Switch
                      name={field.name}
                      ref={field.ref}
                      onBlur={field.onBlur}
                      aria-invalid={fieldState.invalid}
                      id="recurring"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </Field>
                )}
              />
              <div className="flex justify-end items-center w-full pt-3">
                <Button className="rounded-lg" size="sm">
                  {isExecuting ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </FieldGroup>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
