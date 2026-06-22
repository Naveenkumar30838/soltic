import { SarvamAIClient } from "sarvamai";
const apiSubscriptionKey = "sk_3zw8xs1v_O1ey7wq817eWyOnpLUZAEEnz"
const client = new SarvamAIClient({
    apiSubscriptionKey: apiSubscriptionKey
});

const response = await client.chat.completions({
    model: "sarvam-105b",
    messages: [
        { role: "user", content: `Okay so we are building criDe , a cctv survillance system that will be detecting crimes via the cctv cameras for which we are training our deep learning models , we have trained Bilstm and Mlp model ( i have shared the bilstm training code with you to understand the dataset format and structure ) import os
import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
# -------------------------------
# DEVICE
# -------------------------------
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print("Using device:", device)
# -------------------------------
# DATASET
# -------------------------------
class UCFCrimeDataset(Dataset):
    def __init__(self, base_dir):
        self.files = []
        self.labels = []
        categories = sorted(os.listdir(base_dir))
        self.label_map = {cat: i for i, cat in enumerate(categories)}
        print("Classes:", self.label_map)
        for cat in categories:
            cat_path = os.path.join(base_dir, cat)
            if not os.path.isdir(cat_path):
                continue
            for f in os.listdir(cat_path):
                if f.endswith('.npy'):
                    self.files.append(os.path.join(cat_path, f))
                    self.labels.append(self.label_map[cat])
        print(f"Total samples: {len(self.files)}")
    def __len__(self):
        return len(self.files)
    def __getitem__(self, idx):
        x = np.load(self.files[idx])  # [segments, 512]
        y = self.labels[idx]
        return torch.from_numpy(x).float(), torch.tensor(y, dtype=torch.long)
# -------------------------------
# ATTENTION MODULE
# -------------------------------
class Attention(nn.Module):
    def __init__(self, input_dim):
        super().__init__()
        self.attn = nn.Linear(input_dim, 1)
    def forward(self, x):
        # x: [B, S, D]
        weights = torch.softmax(self.attn(x), dim=1)  # [B, S, 1]
        weighted = x * weights
        return torch.sum(weighted, dim=1)  # [B, D]
# -------------------------------
# BiLSTM + ATTENTION MODEL
# -------------------------------
class CrimeBiLSTM_Attention(nn.Module):
    def __init__(self, input_dim=512, hidden_dim=256, num_classes=14):
        super().__init__()
        self.lstm = nn.LSTM(
            input_dim,
            hidden_dim,
            batch_first=True,
            bidirectional=True
        )
        self.attention = Attention(hidden_dim * 2)
        self.classifier = nn.Sequential(
            nn.Linear(hidden_dim * 2, 128),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(128, num_classes)
        )
    def forward(self, x):
        # x: [B, S, 512]
        lstm_out, _ = self.lstm(x)  # [B, S, 2H]
        # Apply attention
        context = self.attention(lstm_out)  # [B, 2H]
        return self.classifier(context)
# -------------------------------
# PATH (YOUR DATASET)
# -------------------------------
DATA_PATH = "/kaggle/input/datasets/naveenkumar30838/extracted-features/kaggle/working/extracted_features"
# -------------------------------
# LOAD DATA
# -------------------------------
dataset = UCFCrimeDataset(DATA_PATH)
loader = DataLoader(
    dataset,
    batch_size=32,
    shuffle=True,
    num_workers=2,
    pin_memory=True
)
# -------------------------------
# MODEL INIT
# -------------------------------
num_classes = len(dataset.label_map)
model = CrimeBiLSTM_Attention(num_classes=num_classes).to(device)
criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=1e-4)
# -------------------------------
# TRAINING LOOP
# -------------------------------
EPOCHS = 200
for epoch in range(EPOCHS):
    model.train()
    total_loss = 0
    for x, y in loader:
        x = x.to(device)  # [B, S, 512]
        y = y.to(device)
        optimizer.zero_grad()
        outputs = model(x)
        loss = criterion(outputs, y)
        loss.backward()
        optimizer.step()
        total_loss += loss.item()
    print(f"Epoch {epoch+1}/{EPOCHS} | Loss: {total_loss / len(loader):.4f}")
# -------------------------------
# SAVE MODEL
# -------------------------------
torch.save(model.state_dict(), "/kaggle/working/bilstm_attention_model.pth")
np.save("/kaggle/working/bilstm_label_map.npy", dataset.label_map)
print("Model + label map saved!")............................................................................. Now our current directory have changed (shared in teh screenshot ) . Now i you have any suggestion How can i make this biLstm Model more better show me the best bilstm training code for this . Secondly Now we want to train a transformer model , give me the code to train transformer based model on this dataset. Also suggest do we How can improve the model for the best real life accuracy, for the best frame understand and best understanding of real life, transformers are the best models (i think , if you suggest someother we can work on it ). Our ultimate goal is to detect crime through the cameras using frames and any suggestion from your side are welcome , we want to make the best software (best in the world ) for this task` }
    ]
});

console.log(response.choices[0].message.content);