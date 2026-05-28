import type { Slide } from "@/types/home";
import { Carousel } from "@mantine/carousel";
import {
  Box,
  Button,
  Center,
  Container,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { Link } from "react-router";
import classes from "./HomePage.module.css";

const slides: Slide[] = [
  {
    heading: "Test any public API",
    subheading: "Fast, simple, no setup",
    text: "Send requests, inspect responses, and explore endpoints in seconds.",
    ctaLabel: "Get started",
    ctaTo: "/register",
  },
  {
    heading: "Debug with confidence",
    subheading: "See every header and payload",
    text: "Full request inspection with rich response visualization and timing.",
    ctaLabel: "Sign in",
    ctaTo: "/login",
    ctaVariant: "secondary",
  },
  {
    heading: "Track your favorite endpoints",
    subheading: "Save and organize",
    text: "Bookmark APIs and access them instantly from your dashboard.",
    ctaLabel: "Learn more",
    ctaTo: "/dashboard/analytics",
  },
];

const HomePage = () => {
  return (
    <Box size="2xl" mx="auto">
      <Container size="lg" px={0}>
        <Carousel
          height={360}
          slideSize="100%"
          controlSize={40}
          withIndicators
          classNames={{ indicator: classes.indicator, control: classes.control }}
        >
          {slides.map((slide) => (
            <Carousel.Slide key={slide.heading}>
              <Center h="100%" p="xl">
                <Stack gap="md" maw={640}>
                  <Title order={1}>{slide.heading}</Title>
                  <Title order={3} c="dimmed" fw={500}>
                    {slide.subheading}
                  </Title>
                  <Text size="md">{slide.text}</Text>
                  <Button
                    component={Link}
                    to={slide.ctaTo}
                    size="md"
                    w="fit-content"
                    classNames={
                      slide.ctaVariant === "secondary"
                        ? {
                            root: classes.ctaRootSecondary,
                            label: classes.ctaLabelSecondary,
                          }
                        : { root: classes.ctaRoot }
                    }
                  >
                    {slide.ctaLabel}
                  </Button>
                </Stack>
              </Center>
            </Carousel.Slide>
          ))}
        </Carousel>
      </Container>
    </Box>
  );
};

export default HomePage;
