// The storybook: every chapter explains one Kubernetes idea the way you'd tell a five-year-old.

export type ChapterId =
  | "hello"
  | "container"
  | "pod"
  | "node"
  | "cluster"
  | "your-towns"
  | "control-plane"
  | "deployment"
  | "service"
  | "ingress"
  | "namespace"
  | "config"
  | "volume"
  | "lens"
  | "quiz";

export interface Chapter {
  readonly id: ChapterId;
  readonly emoji: string;
  readonly title: string;
  readonly story: readonly string[];
  /** The real word grown-ups use, and what it means without the story. */
  readonly grownUpWord?: { readonly word: string; readonly meaning: string };
  /** Where in Lens to go and see the thing for real. */
  readonly seeItInLens?: string;
}

export const chapters: readonly Chapter[] = [
  {
    id: "hello",
    emoji: "👋",
    title: "Hello! What is Kubernetes?",
    story: [
      "Imagine you have lots and lots of toys. Some are robots, some are cars, some are music boxes. Each toy does one job.",
      "On a computer, those toys are called apps. A website is an app. A game is an app. A chat is an app.",
      "Kubernetes is like a super-tidy babysitter for apps. You tell it: \"Please keep my toys running, and if one breaks, fix it!\" And it does. All day. All night. Without getting tired.",
      "People shorten the long name to K8s, because there are 8 letters between the K and the s. Cheeky!",
    ],
    grownUpWord: {
      word: "Kubernetes (K8s)",
      meaning: "A system that runs containerised applications across many computers, and keeps them in the state you asked for.",
    },
    seeItInLens: "Press \"Next\" to begin the story. You can jump to any chapter from the list on the left.",
  },
  {
    id: "container",
    emoji: "📦",
    title: "The container: a lunchbox",
    story: [
      "Before school, someone packs your lunchbox. Sandwich, apple, juice — everything you need is inside.",
      "Wherever you take it — school, the park, grandma's house — you open it and lunch is exactly the same.",
      "A container is a lunchbox for an app. It packs the app together with everything the app needs, so it works the same on any computer.",
    ],
    grownUpWord: {
      word: "Container (and container image)",
      meaning: "A packaged application with its libraries and settings. The image is the recipe; a running container is the lunch you actually eat.",
    },
  },
  {
    id: "pod",
    emoji: "🫛",
    title: "The pod: peas in a pod",
    story: [
      "Have you seen a pea pod? It's a little green shell with peas snuggled inside.",
      "Kubernetes doesn't look after lunchboxes one by one. It puts them in pods. Usually a pod has one lunchbox, sometimes a few best friends that always stay together.",
      "Peas in the same pod share everything: the same home, the same address, the same shelf for their things.",
      "A pod is the smallest thing Kubernetes takes care of. If a pod gets sick, Kubernetes doesn't nurse it — it throws it away and grows a fresh one!",
    ],
    grownUpWord: {
      word: "Pod",
      meaning: "One or more containers scheduled together on the same machine, sharing a network address and storage.",
    },
    seeItInLens: "Open a cluster in the navigator on the left, then Workloads → Pods.",
  },
  {
    id: "node",
    emoji: "🏠",
    title: "The node: a house",
    story: [
      "Pods need somewhere to live. They live in houses.",
      "A node is a house — a real computer (or a pretend one inside a bigger computer).",
      "Every house has only so many rooms. When a house is full, new pods have to move into a different house.",
      "If a house falls down, don't worry: Kubernetes moves the pods into the other houses.",
    ],
    grownUpWord: {
      word: "Node",
      meaning: "A worker machine, physical or virtual, that runs pods. It has a limited amount of CPU and memory.",
    },
    seeItInLens: "Open a cluster, then click Nodes.",
  },
  {
    id: "cluster",
    emoji: "🏘️",
    title: "The cluster: a whole town",
    story: [
      "Put lots of houses together on the same streets and what do you get? A town!",
      "A cluster is a town of nodes. All the houses work together, like neighbours who help each other.",
      "In the middle of town is the town hall, where the grown-ups who run the town sit. (There's a whole chapter about them soon.)",
      "You can have more than one town. Maybe a small practice town to play in, and a big important town where the real work happens.",
    ],
    grownUpWord: {
      word: "Cluster",
      meaning: "A set of nodes plus a control plane that manages them. Everything else in Kubernetes lives inside a cluster.",
    },
    seeItInLens: "Every cluster you have is in the navigator on the left. The next chapter shows yours!",
  },
  {
    id: "your-towns",
    emoji: "🗺️",
    title: "Your towns",
    story: [
      "Let's look at the towns — the clusters — that you have in Lens right now!",
    ],
  },
  {
    id: "control-plane",
    emoji: "🏛️",
    title: "The town hall: who's in charge?",
    story: [
      "Every town needs grown-ups in charge. In Kubernetes they all sit together in the town hall.",
      "📒 The Big Notebook remembers everything: every pod, every house, every wish anybody made. It never forgets.",
      "🙋 The Front Desk is where everyone asks questions and makes wishes. Even Lens talks to the Front Desk!",
      "🧩 The Room Finder decides which house each new pod moves into — one with enough space.",
      "👀 The Checkers walk around town all day asking: \"Is everything the way it was wished for?\" If not, they fix it.",
    ],
    grownUpWord: {
      word: "Control plane",
      meaning: "etcd (the Big Notebook), the API server (the Front Desk), the scheduler (the Room Finder) and the controllers (the Checkers).",
    },
  },
  {
    id: "deployment",
    emoji: "⛄",
    title: "The deployment: \"I always want 3 snowmen\"",
    story: [
      "You go to the Front Desk and say: \"I always want 3 snowmen in my garden.\"",
      "The Checkers build 3 snowmen. When the sun melts one, they notice there are only 2, and quickly build another.",
      "Want a snowman with a new hat? Say so, and they swap the snowmen one at a time, so your garden is never empty.",
      "That wish is a deployment. You never build pods by hand — you write down a wish, and Kubernetes makes it come true.",
    ],
    grownUpWord: {
      word: "Deployment (and ReplicaSet)",
      meaning: "Declares how many copies (replicas) of a pod should run and which version. It rolls out updates gradually and replaces failed pods.",
    },
    seeItInLens: "Open a cluster, then Workloads → Deployments.",
  },
  {
    id: "service",
    emoji: "☎️",
    title: "The service: one phone number",
    story: [
      "Pods come and go all the time, and every new pod gets a new address. How do your friends find them?",
      "A service is like one phone number for a whole group. You call the number and whichever pod is free picks up.",
      "Even when pods are replaced, the phone number stays the same. Nobody has to learn a new one.",
    ],
    grownUpWord: {
      word: "Service",
      meaning: "A stable network name and address that load-balances traffic to a changing set of pods.",
    },
    seeItInLens: "Open a cluster, then Network → Services.",
  },
  {
    id: "ingress",
    emoji: "🚪",
    title: "The ingress: the town gate",
    story: [
      "People from outside the town want to visit too!",
      "The ingress is the big front gate. A friendly guard looks at where each visitor wants to go and points them to the right phone number (service).",
      "\"Shop? Left street. Library? Right street.\"",
    ],
    grownUpWord: {
      word: "Ingress",
      meaning: "Rules that route outside HTTP(S) traffic to services inside the cluster, usually by host name and path.",
    },
    seeItInLens: "Open a cluster, then Network → Ingresses.",
  },
  {
    id: "namespace",
    emoji: "🗂️",
    title: "The namespace: rooms with name tags",
    story: [
      "At home, toys go in the toy room and pots go in the kitchen. That way things don't get mixed up.",
      "Namespaces are rooms inside the town. One team's things go in one room, another team's in another.",
      "Two rooms can each have a toy called \"Teddy\" and nobody gets confused, because they're in different rooms.",
    ],
    grownUpWord: {
      word: "Namespace",
      meaning: "A named partition inside a cluster that groups resources and lets names repeat across groups.",
    },
    seeItInLens: "Open a cluster, then click Namespaces. Most lists in Lens can be filtered by namespace.",
  },
  {
    id: "config",
    emoji: "📝",
    title: "ConfigMaps and Secrets: a recipe card and a diary",
    story: [
      "📝 A ConfigMap is a recipe card stuck on the fridge. Any app can read it: \"Use blue paint. Say hello in English.\"",
      "🔒 A Secret is like a diary with a little lock. It holds things only special apps may read, like passwords.",
      "Keeping these outside the lunchbox means you can change the recipe without packing a new lunchbox.",
    ],
    grownUpWord: {
      word: "ConfigMap and Secret",
      meaning: "Key-value settings handed to pods. Secrets are for sensitive values and are access-controlled.",
    },
    seeItInLens: "Open a cluster, then Config → ConfigMaps or Config → Secrets.",
  },
  {
    id: "volume",
    emoji: "🎒",
    title: "The volume: a backpack",
    story: [
      "When you finish your lunch, the lunchbox gets washed out. Anything you left inside is gone!",
      "Pods are the same: when a pod goes away, everything inside it disappears.",
      "So for things you want to keep — drawings, stickers, saved games — you use a backpack. A volume is that backpack. The pod can come and go, and the backpack stays.",
    ],
    grownUpWord: {
      word: "Volume and PersistentVolumeClaim",
      meaning: "Storage mounted into a pod. A PersistentVolumeClaim asks for storage that outlives the pod.",
    },
    seeItInLens: "Open a cluster, then Storage → Persistent Volume Claims.",
  },
  {
    id: "lens",
    emoji: "🔭",
    title: "Lens: your binoculars",
    story: [
      "You can't walk into a cluster town — it lives inside computers. So how do you look at it?",
      "Lens is your pair of magic binoculars. Point it at a town and you can see every house, every pod and every wish.",
      "The tree on the left (the navigator) is your map. Click a town to visit it, then open the folders to see what's inside.",
      "Grown-ups also use a walkie-talkie called kubectl to talk to the Front Desk by typing. Lens can open one for you in its terminal.",
    ],
    grownUpWord: {
      word: "Lens and kubectl",
      meaning: "Lens is a desktop IDE for Kubernetes. kubectl is the command-line tool that talks to a cluster's API server.",
    },
    seeItInLens: "Right-click a cluster in the navigator and pick \"Explain like I'm 5\" to come back here about that town.",
  },
  {
    id: "quiz",
    emoji: "⭐",
    title: "Quiz time!",
    story: ["Let's see what you remember. Tap the answer you think is right."],
  },
];

export interface QuizQuestion {
  readonly id: string;
  readonly question: string;
  readonly answers: readonly string[];
  readonly correctIndex: number;
  readonly why: string;
}

export const quizQuestions: readonly QuizQuestion[] = [
  {
    id: "lunchbox",
    question: "Which one is the lunchbox that packs an app with everything it needs?",
    answers: ["🏠 Node", "📦 Container", "☎️ Service"],
    correctIndex: 1,
    why: "A container packs the app and everything it needs, just like a lunchbox.",
  },
  {
    id: "town",
    question: "What do we call a whole town of houses working together?",
    answers: ["🏘️ Cluster", "🫛 Pod", "🎒 Volume"],
    correctIndex: 0,
    why: "A cluster is the town: lots of nodes plus the town hall that runs them.",
  },
  {
    id: "snowmen",
    question: "You want 3 snowmen, always. What do you write down?",
    answers: ["📝 ConfigMap", "🚪 Ingress", "⛄ Deployment"],
    correctIndex: 2,
    why: "A deployment is the wish \"keep 3 of these running\", and Kubernetes keeps it true.",
  },
  {
    id: "phone",
    question: "Pods keep changing. How do friends always reach them?",
    answers: ["☎️ Service", "🏠 Node", "🔒 Secret"],
    correctIndex: 0,
    why: "A service is one phone number that always reaches whichever pods are there.",
  },
  {
    id: "smallest",
    question: "What is the smallest thing Kubernetes looks after?",
    answers: ["🏘️ Cluster", "🫛 Pod", "🏛️ Town hall"],
    correctIndex: 1,
    why: "Kubernetes looks after pods. Containers always live inside one.",
  },
];
