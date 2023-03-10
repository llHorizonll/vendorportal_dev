import React, { useState, useEffect } from "react";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import {
  Grid,
  Box,
  Typography,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Link,
  Divider,
} from "@mui/material";
import { GoogleIcon } from "../../utils/svgIcon";
import { useRouter } from "next/router";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const validationSchema = yup.object({
  email: yup.string("Enter your email").email("Enter a valid email").required("Email is required"),
  password: yup
    .string("Enter your password")
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
});

const SignIn = ({ setAuthView, invitationData }) => {
  const supabase = useSupabaseClient();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "all",
    resolver: yupResolver(validationSchema),
  });

  const handleViewChange = (newView) => {
    setAuthView(newView);
  };

  const addContactForNewUser = async () => {
    if (new Date(invitationData.valid_till) > new Date()) {
      console.log(invitationData?.json_info?.contact_info, "add contact");
      alert("add contact success");
      await supabase.from("invitation").update({ valid_till: new Date() }).eq("id", invitationData.id);
      alert("update valid_till");
    }
  };

  const onSubmit = async (values) => {
    console.log(values, "submit");
    try {
      const { data, error, status } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      if (error && status !== 406) {
        throw error;
      }

      if (invitationData) {
        addContactForNewUser();
      } else {
        alert("not create contact");
      }
    } catch (error) {
      alert(error.message);
      console.log(error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth
        .signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: "http://localhost:3000/redirectPage"
          },
        })
        .then(async () => {
          localStorage.setItem("authView", "google_sign_in");
        });

      console.log(data, "data after register google");
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  return (
    <React.Fragment>
      <Typography variant="h4" gutterBottom sx={{ color: "rgba(0, 0, 0, 0.87)" }}>
        Sign In
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container direction={"column"} spacing={2}>
          <Grid item>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Email *"
                  variant="standard"
                  size="small"
                  error={errors.email?.message && Boolean(errors.email?.message)}
                  helperText={errors.email?.message}
                />
              )}
            />
          </Grid>
          <Grid item>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Password *"
                  variant="standard"
                  type="password"
                  size="small"
                  error={errors.password?.message && Boolean(errors.password?.message)}
                  helperText={errors.password?.message}
                />
              )}
            />
          </Grid>
          <Grid item>
            <Button type="submit" variant="contained" fullWidth sx={{ marginBottom: 2 }}>
              Sign In
            </Button>
          </Grid>
        </Grid>
      </form>

      <Divider sx={{ marginBottom: 1 }}>
        <Typography sx={{ color: "rgba(0, 0, 0, 0.4)" }}>or</Typography>
      </Divider>
      <Button
        fullWidth
        variant="outlined"
        startIcon={<GoogleIcon />}
        onClick={() => signInWithGoogle()}
        sx={{ marginBottom: 2 }}
      >
        Sign in with Google
      </Button>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Link
          href={"#forgot_password"}
          onClick={(e) => {
            e.preventDefault();
            handleViewChange("forgot_password");
          }}
        >
          Forgot your password?
        </Link>
        {/* <Link
          href={"#create_bu"}
          onClick={(e) => {
            e.preventDefault();
            handleViewChange("create_bu");
          }}
        >
          Don't have an account? Create account
        </Link> */}
      </Box>
    </React.Fragment>
  );
};

export default SignIn;
