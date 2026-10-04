# Kubernetes for Kids

Never touched Kubernetes? This extension explains it inside Lens the way you'd explain it to a five-year-old: containers are lunchboxes, pods are peas in a pod, nodes are houses, and a cluster is a whole town with a town hall that runs it.

## Features

- **A storybook tab.** 15 short chapters: container, pod, node, cluster, the control plane, deployments, services, ingress, namespaces, ConfigMaps and Secrets, volumes, and Lens itself. Each chapter tells a simple story, then gives the real "grown-up word" and where to find that thing in Lens.
- **Your own clusters, explained.** The "Your towns" chapter lists every cluster you have in Lens as a town. It says whether each one is awake (Lens is connected to it) or sleeping. For awake towns it counts the houses (nodes), pea pods (pods) and rooms (namespaces) live.
- **Animated pictures on every page.** Each chapter has its own little animated scene: the town's car drives by, the melted snowman gets rebuilt, the town gate's visitors walk in. They stay still if your system is set to reduce motion.
- **An AI helper for your questions.** Under every page, "Got a question?" opens Lens's Ask AI right there. It already knows the page you're on and answers in the storybook's simple words. Each page keeps its own conversation, and the helper only looks at your cluster, never changes it. You need an AI tool set up in Lens (Preferences) and at least one cluster.
- **A quiz** at the end, to check what stuck.

## Install

[Open Kubernetes for Kids in Lens](https://app.k8slens.dev/lens-launcher?c=lens%3A%2F%2Fapp%2Fopen%2Fextension%3Fname%3D%2540k8slens%252Fkubernetes-for-kids) and click Install there. The link offers Lens for download when it is not installed yet.

## Usage

Open the storybook in any of these ways:

- Click the **?** button on the right of Lens's top bar.
- Open the command palette and run **Kubernetes for Kids: Open**.
- Right-click a cluster in the navigator and pick **Explain like I'm 5**. This opens the "Your towns" chapter with that cluster highlighted.

Use **Next →** and **← Back** to read in order, or jump to any chapter from the list on the left.

What changed in each version is in [CHANGELOG.md](./CHANGELOG.md).
