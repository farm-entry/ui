import { CardActionArea, Stack, Typography } from "@mui/material";
import { PageContainer } from "@toolpad/core/PageContainer";
import { useNavigate } from "react-router";
import { CustomCard } from "../components/framework";
import { useVisibleRoutes } from "../hooks/useVisibleRoutes";

export default function DashboardPage() {
  const navigate = useNavigate();
  const visibleRoutes = useVisibleRoutes();

  return (
    <>
      <PageContainer>
        <Stack spacing={2}>
          {visibleRoutes.map(({ segment, title, description, Icon }) => (
            <CustomCard key={segment} variant="outlined" full>
              <CardActionArea onClick={() => navigate(segment)} sx={{ p: 2 }}>
                <Stack direction="row" spacing={2}>
                  <Stack justifyContent="center">
                    {Icon && <Icon color="primary" sx={{ fontSize: 21 }} />}
                  </Stack>
                  <Stack direction="column">
                    <Typography variant="h6">{title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {description}
                    </Typography>
                  </Stack>
                </Stack>
              </CardActionArea>
            </CustomCard>
          ))}
        </Stack>
      </PageContainer>
    </>
  );
}
