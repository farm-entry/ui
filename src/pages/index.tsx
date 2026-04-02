import { CardActionArea, Stack, Typography } from "@mui/material";
import { PageContainer } from "@toolpad/core/PageContainer";
import { useNavigate } from "react-router";
import { CustomCard } from "../components/framework";
import { MAIN_ROUTES } from "../routes";

const dashboardCards = MAIN_ROUTES.filter((r) => r.description).map(
  ({ segment, title, description, Icon }) => ({
    label: title,
    href: segment,
    description: description!,
    icon: Icon ? <Icon color="primary" sx={{ fontSize: 21 }} /> : undefined
  })
);

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <>
      <PageContainer>
        <Stack spacing={2}>
          {dashboardCards.map((option) => (
            <CustomCard key={option.label} variant="outlined" full>
              <CardActionArea onClick={() => navigate(option.href)} sx={{ p: 2 }}>
                <Stack direction="row" spacing={2}>
                  <Stack justifyContent="center">{option.icon}</Stack>
                  <Stack direction="column">
                    <Typography variant="h6">{option.label}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {option.description}
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
