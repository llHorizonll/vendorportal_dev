import React, { useState, useEffect } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { adminAuthClient } from "../../lib/supabaseServer";
import { useRouter } from "next/router";

import { Box, Toolbar, Grid, TextField, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const validationSchema = yup.object({
  password: yup
    .string("Enter your password")
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
});

const ProfileDetail = () => {
  const supabase = useSupabaseClient();
  const router = useRouter();
  const pathData = router.query;
  const userId = pathData.id;
  const [isLoading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
      cfpassword: "",
    },
    mode: "all",
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (values) => {
    setLoading(true);
    await supabase
      .from("users")
      .update({ providers: ["email"], active: true })
      .eq("id", userId);

    await adminAuthClient.auth.admin.updateUserById(userId, {
      password: values.password,
      app_metadata: { providers: ["email"] },
    });
    alert("success");
    setLoading(false);
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3, background: "rgb(243, 244, 249)", minHeight: "929px" }}>
      <Toolbar />
      <>
        <Typography variant="h6" sx={{ color: "rgba(0, 0, 0, 0.87)" }}>
          Profile
          <div>ProfileDetail : {JSON.stringify(pathData)}</div>
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container direction={"column"} spacing={2}>
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
              <Controller
                name="cfpassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Confirm Password *"
                    variant="standard"
                    type="password"
                    size="small"
                    error={errors.cfpassword?.message && Boolean(errors.cfpassword?.message)}
                    helperText={errors.cfpassword?.message}
                  />
                )}
              />
            </Grid>
            <Grid item>
              <LoadingButton type="submit" loading={isLoading} variant="contained" fullWidth sx={{ marginBottom: 1 }}>
                <span>Set new password</span>
              </LoadingButton>
            </Grid>
          </Grid>
        </form>
      </>
    </Box>
  );
};

export default ProfileDetail;
