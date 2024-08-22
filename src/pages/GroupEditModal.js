import React, { useState } from 'react';
import axios from 'axios';
import './GroupEditModal.css';

function GroupEditModal({ isOpen, onClose, groupId }) {
    const [name, setName] = useState('');
    const [imageUpload, setImageUpload] = useState(null);
    const [introduction, setIntroduction] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const uploadImageAndGetURL = async () => {
        if (!imageUpload) {
            setMessage('이미지 파일을 선택해주세요.');
            return null;
        }

        const formData = new FormData();
        formData.append('image', imageUpload);

        try {
            const response = await axios({
                method: 'post',
                url: 'https://zogakzip-api-gr4l.onrender.com/api/image',
                data: formData
            });
            return response.data.imageUrl;
        } catch (error) {
            setMessage('이미지 업로드 실패');
            return null;
        }
    };    

    const submitForm = async (e) => {
        e.preventDefault();

        const imageUrl = await uploadImageAndGetURL();
        if (!imageUrl) {
            setMessage('이미지 업로드에 실패했습니다.');
            return; 
        } 

        const groupData = {
            name: name,          
            password: password,  
            imageUrl: imageUrl,  
            isPublic: isPublic,  
            introduction: introduction 
        }

        try {
            const response = await axios({
                method: 'put',
                url: `https://zogakzip-api-gr4l.onrender.com/api/groups/${groupId}`,
                headers: {
                    'Content-Type': 'application/json' 
                },
                data: JSON.stringify(groupData)
            });
            setMessage(`그룹 수정 성공: ${response.data.name}`);
            onClose(); // 모달 닫기
        } catch (error) {
            if (error.response) {
                switch (error.response.status) {
                    case 400:
                        setMessage("잘못된 요청입니다: " + error.response.data.message);
                        break;
                    case 403:
                        setMessage("비밀번호가 틀렸습니다: " + error.response.data.message);
                        break;
                    case 404:
                        setMessage("그룹이 존재하지 않습니다: " + error.response.data.message);
                        break;
                    default:
                        setMessage("에러가 발생했습니다: " + error.response.data.message);
                }
            } else {
                setMessage("서버가 응답하지 않거나 네트워크 오류가 발생했습니다.");
            }
        }
    };

    return (
        <div className={isOpen ? "modal display-block" : "modal display-none"}>
            <div className="modal-content">
                <span className="close-button" onClick={onClose}>&times;</span>
                <h2>그룹 정보 수정</h2>
                <form onSubmit={submitForm}>
                    <div className="form-group">
                        <label htmlFor="name">그룹명</label>
                        <input type="text" id="name" name="name" placeholder="그룹명을 입력하세요" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="imageUpload">대표 이미지</label>
                        <input type="file" id="imageUpload" name="imageUpload" onChange={(e) => setImageUpload(e.target.files[0])} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="introduction">그룹 소개</label>
                        <textarea id="introduction" name="introduction" placeholder="그룹을 소개해 주세요" value={introduction} onChange={(e) => setIntroduction(e.target.value)}></textarea>
                    </div>

                    <div className="form-group">
                        <label htmlFor="isPublic">그룹 공개 선택</label>
                        <div className="switch">
                            공개:
                            <input type="checkbox" id="isPublic" name="isPublic" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
                            <span className="slider round"></span>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">수정 권한 인증</label>
                        <input type="password" id="password" name="password" placeholder="비밀번호를 입력해 주세요" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button type="submit">수정하기</button>
                </form>
            </div>
        </div>
    );
}

export default GroupEditModal;
