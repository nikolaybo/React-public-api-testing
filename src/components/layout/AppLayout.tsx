import {
  Anchor,
  Box,
  Burger,
  Container,
  Divider,
  Drawer,
  Group,
  Menu,
  NavLink as MantineNavLink,
  ScrollArea,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronDown } from "@tabler/icons-react";
import { NavLink, Outlet, useLocation } from "react-router";
import ColorSchemeToggle from "@/components/theme/ColorSchemeToggle";
import { getFooterLinks, getHeaderTree } from "@/helpers/navigation.helper";
import type { NavLinkItem, NavLinkNode } from "@/types/navigation";
import classes from "./AppLayout.module.css";

export default function AppLayout() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const { pathname } = useLocation();

  const renderLink = (link: NavLinkItem) => (
    <Anchor
      key={link.path}
      component={NavLink}
      to={link.path}
      className={classes.link}
      data-active={pathname === link.path || undefined}
      onClick={close}
      underline="never"
    >
      {link.label}
    </Anchor>
  );

  const renderHeaderNode = (node: NavLinkNode) => {
    if (node.children.length === 0) return renderLink(node);

    return (
      <Menu
        key={node.path}
        trigger="click-hover"
        position="bottom-start"
        withinPortal
      >
        <Menu.Target>
          <UnstyledButton
            className={classes.link}
            data-active={pathname.startsWith(node.path) || undefined}
          >
            <Group gap={4} wrap="nowrap">
              {node.label}
              <IconChevronDown size={14} />
            </Group>
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>
          {node.children.map((child) => (
            <Menu.Item
              key={child.path}
              component={NavLink}
              to={child.path}
              onClick={close}
              data-active={pathname === child.path || undefined}
            >
              {child.label}
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>
    );
  };

  const headerNodes = getHeaderTree();
  const leftItems = headerNodes
    .filter((n) => n.side === "left")
    .map(renderHeaderNode);
  const rightItems = headerNodes
    .filter((n) => n.side === "right")
    .map(renderHeaderNode);
  const footerItems = getFooterLinks().map(renderLink);

  return (
    <Box className={classes.shell}>
      <Box component="header" className={classes.header}>
        <Container size="lg" h={56}>
          <Group justify="space-between" align="center" h="100%">
            <Group gap={5} visibleFrom="xs">
              {leftItems}
            </Group>

            <Group gap={5} visibleFrom="xs">
              {rightItems}
              <ColorSchemeToggle />
            </Group>

            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="xs"
              size="sm"
              aria-label="Toggle navigation"
            />
          </Group>
        </Container>

        <Drawer
          opened={opened}
          onClose={close}
          size="100%"
          padding="md"
          title="Navigation"
          hiddenFrom="xs"
          zIndex={1000000}
        >
          <ScrollArea h="calc(100vh - 80px)" mx="-md">
            <Divider my="sm" />
            {headerNodes.map((node) =>
              node.children.length === 0 ? (
                <MantineNavLink
                  key={node.path}
                  component={NavLink}
                  to={node.path}
                  label={node.label}
                  onClick={close}
                  active={pathname === node.path}
                />
              ) : (
                <MantineNavLink
                  key={node.path}
                  label={node.label}
                  defaultOpened={pathname.startsWith(node.path)}
                >
                  {node.children.map((child) => (
                    <MantineNavLink
                      key={child.path}
                      component={NavLink}
                      to={child.path}
                      label={child.label}
                      onClick={close}
                      active={pathname === child.path}
                    />
                  ))}
                </MantineNavLink>
              ),
            )}
          </ScrollArea>
        </Drawer>
      </Box>

      <Box component="main" flex={1}>
        <Outlet />
      </Box>

      <Box component="footer" className={classes.footer}>
        <Container size="md">
          <Group gap="md" justify="center">
            {footerItems}
          </Group>
        </Container>
      </Box>
    </Box>
  );
}
